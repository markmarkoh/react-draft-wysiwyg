/* @flow */

import React, { PureComponent } from 'react';
import { Editor } from '../../src';

/**
 * Default trigger is '@' and default separator between words is ' '.
 * thus there fields are optional.
*/

class Test extends PureComponent {
  render() {
    console.log(this.props);
    return <div>hi {this.props.decoratedText}</div>;
  }
}

const Mention = () =>
  (<div className="rdw-storybook-root">
    <span>Type @ to see suggestions</span>
    <Editor
      mentions={[{
      separator: ' ',
      trigger: '@',
      MentionComponent: Test,
      suggestions: [
        { text: 'APPLE', value: 'apple', url: 'apple' },
        { text: 'BANANA', value: 'banana', url: 'banana' },
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
    />
   </div>);

export default Mention;
