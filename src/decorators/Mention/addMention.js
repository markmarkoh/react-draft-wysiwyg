import {
  EditorState,
  Modifier,
  AtomicBlockUtils,
} from 'draft-js';
import { getSelectedBlock } from 'draftjs-utils';

export default function addMention(
  editorState: EditorState,
  onChange: Function,
  separator: string,
  trigger: string,
  suggestion: Object,
  type: string,
): void {
  const { value, url } = suggestion;
  const entityKey = editorState
    .getCurrentContent()
    .createEntity(type, 'IMMUTABLE', { text: `${trigger}${value}`, value, url })
    .getLastCreatedEntityKey();


  const focusOffset = editorState.getSelection().focusOffset;
  const selectedBlock = getSelectedBlock(editorState);
  const selectedBlockText = selectedBlock.getText();
  const mentionIndex = (selectedBlockText.lastIndexOf(separator + trigger, focusOffset) || 0) + 1;
  const updatedSelection = editorState.getSelection().merge({
    anchorOffset: mentionIndex,
    focusOffset,
  });

  const contentState = Modifier.replaceText(
    editorState.getCurrentContent(),
    updatedSelection,
    '',
    editorState.getCurrentInlineStyle(),
    entityKey,
  );

  let newEditorState = EditorState.push(editorState, contentState, 'insert-characters');

  newEditorState = AtomicBlockUtils.insertAtomicBlock(
    newEditorState,
    entityKey,
    `${trigger}(${value})`, // for draft to markdown
  );

  // console.log('getCurrentContent', newEditorState.getCurrentContent());
  // console.log('selected block', getSelectedBlock(editorState));
  // console.log('focusOffset', editorState.getSelection().focusOffset);
  onChange(newEditorState);
  return;
  // const selectedBlock = getSelectedBlock(editorState);
  // const selectedBlockText = selectedBlock.getText();
  // let focusOffset = editorState.getSelection().focusOffset;
  // const mentionIndex = (selectedBlockText.lastIndexOf(separator + trigger, focusOffset) || 0) + 1;
  // let spaceAlreadyPresent = false;
  // if (selectedBlockText.length === mentionIndex + 1) {
  //   focusOffset = selectedBlockText.length;
  // }
  // if (selectedBlockText[focusOffset] === ' ') {
  //   spaceAlreadyPresent = true;
  // }
  // const updatedSelection = editorState.getSelection().merge({
  //   anchorOffset: mentionIndex,
  //   focusOffset,
  // });
  // newEditorState = EditorState.acceptSelection(editorState, updatedSelection);
  // const contentState = Modifier.replaceText(
  //   newEditorState.getCurrentContent(),
  //   updatedSelection,
  //   `${trigger}${value}`,
  //   newEditorState.getCurrentInlineStyle(),
  //   entityKey,
  // );
  // newEditorState = EditorState.push(newEditorState, contentState, 'insert-characters');
  //
  // if (!spaceAlreadyPresent) {
  //   // insert a blank space after mention
  //   updatedSelection = newEditorState.getSelection().merge({
  //     anchorOffset: mentionIndex + value.length + trigger.length,
  //     focusOffset: mentionIndex + value.length + trigger.length,
  //   });
  //   newEditorState = EditorState.acceptSelection(newEditorState, updatedSelection);
  //   contentState = Modifier.insertText(
  //     newEditorState.getCurrentContent(),
  //     updatedSelection,
  //     ' ',
  //     newEditorState.getCurrentInlineStyle(),
  //     undefined,
  //   );
  // }
  onChange(EditorState.push(newEditorState, contentState, 'insert-characters'));
}
