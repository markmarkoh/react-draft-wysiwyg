/* @flow */
/* eslint-disable react/no-multi-comp */
/* eslint-disable */
import React, { PureComponent, Component } from 'react';
import { EditorState, Entity, CompositeDecorator, convertToRaw, convertFromRaw } from 'draft-js';
import draftToMarkdown from 'draftjs-to-markdown';
import { Editor } from '../../src';
import { markdownToDraft } from 'markdown-draft-js';


class Test extends PureComponent {
  props: {
    contentState: any,
    entityKey: any,
    decoratedText: string
  }
  render() {
    console.log('Test Render');
    const { contentState, entityKey } = this.props;
    console.log(this.props);
    const data = contentState.getEntity(entityKey).getData();
    console.log(data);

    return <div style={{ border: '1px solid blue', padding: '5px' }}>Hello You</div>;
  }
}

class ConvertToRawDraftContentEditor extends Component {
  constructor(props) {
    super(props);
    const rawData = markdownToDraft('## Hello\ncool\n\n@(https://coool.com)\n\nnice', {
      remarkablePlugins: [mentionWrapper],
      blockEntities: {
        mention_open(item) {
          return {
            type: 'RAD',
            mutability: 'IMMUTABLE',
            data: {
              url: item.url,
              value: `(${item.url})`,
              text: `@(${item.url})`
            },
          };
        }
      },
    });

    /*
    I can't find a way to force the block type to be atomic, so we check for any entities referenced
    by this block and if we see at least one, we switch the type to atomic.
    TODO: A better check on the `block.text` to see if it matches @(http://....com/url)
    */
    const augmentedRawData = {
      entityMap: rawData.entityMap,
      blocks: rawData.blocks.map(block => {
        if (block.entityRanges.length > 0) {
          return {
            ...block,
            type: 'atomic'
          }
        }
        return block
      })
    }

    const contentState = convertFromRaw(augmentedRawData);
    const newEditorState = EditorState.createWithContent(contentState);
    this.state = { editorState: newEditorState };
  }

  onEditorStateChange: Function = (editorState) => {
    this.setState({
      editorState,
    });
  };

  render() {
    const { editorState } = this.state;
    return (<div className="rdw-storybook-root">
      <Editor
        editorState={editorState}
        mentions={[{
        separator: ' ',
        trigger: '@',
        MentionComponent: Test,
        type: 'RAD',
        suggestions: [
          { text: 'Apple Search Presentation', value: 'https://coool.com', url: 'https://cool.com', icon: 'Ʊ' },
          { text: 'BANANA', value: 'Abanana', url: 'banana' },
          { text: 'CHERRY', value: 'cherry', url: 'cherry' },
          { text: 'DURIAN', value: 'durian', url: 'durian' },
          { text: 'EGGFRUIT', value: 'eggfruit', url: 'eggfruit' },
          { text: 'FIG', value: 'fig', url: 'fig' },
          { text: 'GRAPEFRUIT', value: 'grapefruit', url: 'grapefruit' },
          { text: 'HONEYDEW', value: 'honeydew', url: 'honeydew' },
        ],
      }]}
        toolbarClassName="rdw-storybook-toolbar"
        wrapperClassName="rdw-storybook-wrapper"
        editorClassName="rdw-storybook-editor"
        customDecorators={decorator}
        onEditorStateChange={this.onEditorStateChange}
      />
      <textarea
        readOnly
        className="rdw-storybook-textarea"
        value={draftToMarkdown(convertToRaw(editorState.getCurrentContent()))}
      />
    </div>);
  }
}

const MentionRegexp = /@\((.*)\)/;
function mentionWrapper(remarkable) {
  remarkable.inline.ruler.push('mention', function mention(state, silent) {
    // it is surely not our rule, so we could stop early
    if (!state.src) {
      return false;
    }

    if (state.src[state.pos] !== '@') {
      return false;
    }

    var match = MentionRegexp.exec(state.src);

    if (!match) {
      return false;
    }

    // in silent mode it shouldn't output any tokens or modify pending
    if (!silent) {
      state.push({
        type: 'mention_open',
        url: match[1],
        id: match[2],
        level: state.level
      });

      state.push({
        type: 'text',
        url: match[1],
        cool: true,
        content: `@(${match[1]})`,
        level: state.level + 1
      });

      state.push({
        type: 'mention_close',
        level: state.level
      });
    }

    // every rule should set state.pos to a position after token"s contents
    state.pos += match[0].length;

    return true;
  });
}

export default ConvertToRawDraftContentEditor;
