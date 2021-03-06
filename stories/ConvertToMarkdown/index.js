/* @flow */
/* eslint-disable react/no-multi-comp */

import React, { PureComponent, Component } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import draftToMarkdown from 'draftjs-to-markdown';
import { Editor } from '../../src';

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
  state = {
    editorState: EditorState.createEmpty(),
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
          { text: 'Apple Search Presentation', value: '(https://coool.com)', url: 'https://cool.com' },
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

export default ConvertToRawDraftContentEditor;
