import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './styles.css';

class Mention {
  constructor(config) {
    this.className = config.mentionClassName;
    this.type = config.type;
    this.MentionComponent = config.MentionComponent;
  }
  getMentionComponent = () => {
    if (this.MentionComponent) {
      return this.MentionComponent;
    }
    const MentionComponent = ({ entityKey, children, contentState }) => {
      const { url, value } = contentState.getEntity(entityKey).getData();
      return (
        <a href={url || value} className={classNames('rdw-mention-link', this.className)}>
          {children}
        </a>
      );
    };
    MentionComponent.propTypes = {
      entityKey: PropTypes.number,
      children: PropTypes.array,
      contentState: PropTypes.object,
    };
    return MentionComponent;
  };
  getMentionDecorator = () => ({
    strategy: this.findMentionEntities,
    component: this.getMentionComponent(),
  });
  findMentionEntities = (contentBlock, callback, contentState) => {
    contentBlock.findEntityRanges(
      (character) => {
        const entityKey = character.getEntity();
        return (
          entityKey !== null &&
          contentState.getEntity(entityKey).getType() === this.type
        );
      },
      callback,
    );
  };
}

export default Mention;
