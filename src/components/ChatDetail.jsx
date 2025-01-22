import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as AddtoMessage } from '../assets/IconAddtoMessage.svg';
import { ReactComponent as AttachSvg } from '../assets/iconAttachment.svg';
import { ReactComponent as IconAutoSend } from '../assets/IconAutoSend.svg';
import { ReactComponent as SendSvg } from '../assets/iconSend.svg';
import { ReactComponent as IconThreeDots } from '../assets/IconThreeDots.svg';
import { ReactComponent as IconThumbsDown } from '../assets/IconThumbsDown.svg';
import { useSocketContext } from '../context/SocketContext';
import {
  formatStringTimeToHHMM,
  generateTimestamp,
} from '../utils/timestamp.js';
import './ChatDetail.css';
import ChatHeader from './ChatHeader.jsx';
import FeedbackAI from './FeedbackAi.jsx';

import { SENDER_ADMIN, SENDER_BOT, SENDER_USER } from '../utils/constants';

const ChatDetail = ({ conversationId, onSendMessage }) => {
  const { t } = useTranslation();

  const [managerMessage, setManagerMessage] = useState('');
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
          sender: SENDER_ADMIN,
          admin_id: '55',
          conversationID: conversation.id,
          user: SENDER_ADMIN,
          timestamp: generateTimestamp(),
        })
      );

      onSendMessage(managerMessage);
      setManagerMessage('');
    }
  };

  const getIcon = (sender) => {
    switch (sender) {
      case SENDER_BOT:
        return '🤖';
      case 'bot_on_hold':
        return '⏳';
      case SENDER_USER:
        return '👤';
      case SENDER_ADMIN:
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

  const formatSentTime = (timestamp) => {
    return formatStringTimeToHHMM(timestamp);
  };

  return (
    <div className='chat-detail-container'>
      <ChatHeader conversation={conversation} />
      <div className='chat-detail__messages'>
        {conversation.messages.map((msg, index) => {
          return (
            <div key={msg.timestamp} className='chat-container'>
              {msg.text && (
                <>
                  <span className={`text-sent text-sent-${msg.sender}`}>
                    {formatSentTime(msg.timestamp)}
                  </span>

                  <div
                    key={index}
                    className={`chat-detail__message--${msg.sender}`}
                  >
                    <span className='chat-detail__icon'>
                      {getIcon(msg.sender)}
                    </span>
                    <p>{msg.text}</p>
                  </div>
                </>
              )}

              {msg.sender === 'bot' && index > 0 && (
                <div className='fade-div fade-in'>
                  <div className='bottom-bar'>
                    <div className='left-buttons'>
                      <IconThreeDots className='icon-threedots' />
                      <div className='left-button-options'>
                        <button
                          className='bottom-bar-button'
                          onClick={() => copyTextToReview(index, msg.text)}
                        >
                          <AddtoMessage className='icon-addtomessage' />
                        </button>
                        <div className='seperator-line'>.</div>
                        <button
                          className='bottom-bar-button'
                          onClick={() => toggleDivVisibility(index)}
                        >
                          <IconThumbsDown className='icon-thumbsdown' />
                        </button>
                      </div>
                    </div>
                    <div className='right-buttons'>
                      <button
                        className='bottom-bar-button'
                        onClick={() => sendToUser(msg.text)}
                      >
                        <IconAutoSend className='icon-auto-send' />
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
          <div className='chatinputbutton-container'>
            <button
              className='chat-detail__button_attachment'
              onClick={handleSend}
            >
              <span className='button-chev'>
                <AttachSvg className='icon-attachsvg' />{' '}
              </span>
            </button>
            <button className='chat-detail__button' onClick={handleSend}>
              <span className='button-chev'>
                <SendSvg className='icon-sendsvg' />{' '}
              </span>
            </button>
          </div>
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
