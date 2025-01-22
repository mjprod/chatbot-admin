import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSocketContext } from '../context/SocketContext';
import { generateTimestamp } from '../utils/timestamp.js';
import './ChatDetail.css';
import ChatHeader from './ChatHeader.jsx';
import FeedbackAI from './FeedbackAi.jsx';

import { ReactComponent as IconAddtoMessage } from '../assets/IconAddtoMessage.svg';
import { ReactComponent as IconAutoSend } from '../assets/IconAutoSend.svg';
import { ReactComponent as IconThumbsDown } from '../assets/IconThumbsDown.svg';

const ChatDetail = ({ conversationId, onSendMessage }) => {
  const { t } = useTranslation();

  const [managerMessage, setManagerMessage] = useState('');
  const [expandedMessageIndex, setExpandedMessageIndex] = useState(null);

  const { sendMessage, conversations } = useSocketContext();

  const conversation = conversations.find((conv) => conv.id === conversationId);
  const [visibleDivs, setVisibleDivs] = useState({});

  useEffect(() => {
    if (conversation) {
      console.log('conversation', conversation);
    }
  }, [conversation]);

  const handleSend = (text) => {
    if (managerMessage.trim() || text) {
      sendMessage(
        JSON.stringify({
          text: managerMessage || text,
          sender: 'admin',
          admin_id: '55',
          conversationID: conversation.id,
          user: 'admin',
          timestamp: generateTimestamp(),
          show_chat: text ? true : false,
        })
      );

      onSendMessage(managerMessage);
      setManagerMessage('');
    }
  };

  const getIcon = (sender) => {
    switch (sender) {
      case 'bot':
        return '🤖';
      case 'bot_on_hold':
        return '⏳';
      case 'user':
        return '👤';
      case 'admin':
        return '👨‍💻';
      default:
        return '❓';
    }
  };

  if (!conversation) {
    return (
      <div className='chat-detail__empty'>
        <h6>Select a conversation to view details.</h6>
      </div>
    );
  }

  const handleToggleExpand = (index) => {
    setExpandedMessageIndex(expandedMessageIndex === index ? null : index);
  };

  const toggleDivVisibility = (index) => {
    setVisibleDivs((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const copyTextToReview = (index, text) => {
    if (conversation.status === 'HOLD ON') {
      setManagerMessage(text);
    } else {
      alert(t('conversation_on_hold_first'));
    }
  };
  const sendToUser = (text) => {
    handleSend(text);
  };
  return (
    <div className='chat-detail-container'>
      <ChatHeader conversation={conversation} />
      <div className='chat-detail__messages'>
        {conversation.messages.map((msg, index) => {
          return (
            <div key={msg.timestamp} className='chat-container'>
              {msg.text && (
                <div
                  key={index}
                  className={`chat-detail__message--${msg.sender}`}
                >
                  <span className='chat-detail__icon'>
                    {getIcon(msg.sender)}
                  </span>
                  <p>{msg.text}</p>
                </div>
              )}

              {msg.sender === 'bot' && index > 0 && (
                <div className='fade-div fade-in'>
                  <div className='bottom-bar'>
                    <div className='left-buttons'>
                      <button
                        className='bottom-bar-button'
                        onClick={() => copyTextToReview(index, msg.text)}
                      >
                        <IconAddtoMessage />
                      </button>
                      <button
                        className='bottom-bar-button'
                        onClick={() => toggleDivVisibility(index)}
                      >
                        <IconThumbsDown />
                      </button>
                    </div>
                    <div className='right-buttons'>
                      <button
                        className='bottom-bar-button'
                        onClick={() => sendToUser(msg.text)}
                      >
                        <IconAutoSend />
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {/* Fading Div */}
              {visibleDivs[index] && (
                <div className='fade-div fade-in'>
                  <FeedbackAI conversation_id={conversationId} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {conversation.status === 'HOLD ON' && (
        <div className='chat-detail__input-container'>
          <textarea
            className='chat-detail__textarea'
            value={managerMessage}
            onChange={(e) => setManagerMessage(e.target.value)}
            placeholder='Write a message...'
          />
          <button className='chat-detail__button' onClick={handleSend}>
            <span className='button-chev'>› </span>
          </button>
        </div>
      )}
    </div>
  );
};
ChatDetail.propTypes = {
  conversationId: PropTypes.string.isRequired,
  onSendMessage: PropTypes.func.isRequired,
};

export default ChatDetail;
