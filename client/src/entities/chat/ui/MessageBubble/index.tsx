import React from 'react';
import { Message } from '../../model/types';
import classes from './MessageBubble.module.scss';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  currentUserId: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn }) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getMediaUrl = (mediaKey: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    return `${apiUrl}/api/images/${mediaKey}`;
  };

  return (
    <div className={`${classes.messageContainer} ${isOwn ? classes.outgoing : classes.incoming}`}>
      {!isOwn && message.sender?.logoKey && (
        <img
          src={getMediaUrl(message.sender.logoKey)}
          alt={message.sender.name || 'User'}
          className={classes.avatar}
        />
      )}
      
      <div className={`${classes.bubble} ${isOwn ? classes.outgoing : classes.incoming}`}>
        {message.content && (
          <div className={classes.content}>{message.content}</div>
        )}
        
        {message.mediaKey && message.mediaType === 'image' && (
          <div className={classes.media}>
            <img src={getMediaUrl(message.mediaKey)} alt="Shared image" />
          </div>
        )}
        
        {message.mediaKey && message.mediaType === 'video' && (
          <div className={classes.media}>
            <video controls src={getMediaUrl(message.mediaKey)} />
          </div>
        )}
        
        <div className={classes.timestamp}>
          {formatTime(message.createdAt)}
        </div>
      </div>
    </div>
  );
};
