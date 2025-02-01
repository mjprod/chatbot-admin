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
import ChatEmptyState from './ChatEmptyState';

const ChatDetail = ({ conversationId, onSendMessage }) => {
  const { t, i18n } = useTranslation();

  const [managerMessage, setManagerMessage] = useState('');
  const { sendMessage, conversations } = useSocketContext();

  const conversation = conversations.find((conv) => conv.id === conversationId);
  const [visibleDivs, setVisibleDivs] = useState({});

  const [languageSelected, setLanguageSelected] = useState('en');

  useEffect(() => {
    if (conversation?.messages?.length > 0) {
      const initialLanguage = conversation.messages[0]?.language || 'en';
      setLanguageSelected(initialLanguage);
      i18n.changeLanguage(initialLanguage); // Update the translation library
      setLanguageSelected(initialLanguage);
    } else {
      // Set a default language when conversation.messages is invalid
      setLanguageSelected('en');
      i18n.changeLanguage('en');
    }
  }, [conversation?.messages, i18n]);

  useEffect(() => {
    if (conversation) {
      console.log('conversation', conversation);
    }
  }, [conversation]);

  const handleSend = (text) => {
    if (
      (managerMessage && managerMessage.trim()).length > 1 ||
      text.length > 1
    ) {
      sendMessage(
        JSON.stringify({
          text: managerMessage || text,
          sender: SENDER_ADMIN,
          admin_id: '55',
          conversationID: conversation.id,
          user: SENDER_ADMIN,
          status: conversation.status,
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
      case SENDER_USER:
        return '👤';
      case SENDER_ADMIN:
        return '👨‍💻';
      default:
        return '❓';
    }
  };

  if (!conversation) {
    return <ChatEmptyState />;
  }

  const toggleDivVisibility = (index) => {
    if (conversation.status === 'HOLD ON') {
      setVisibleDivs((prevState) => ({
        ...prevState,
        [index]: !prevState[index],
      }));
    } else {
      alert(t('conversation_on_hold_first'));
    }
  };

  const copyTextToReview = (text) => {
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
        {conversation.messages?.map((msg, index) => {
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
                <div className=' fade-in'>
                  <div className='bottom-bar'>
                    <div className='left-buttons'>
                      <IconThreeDots className='icon-threedots' />
                      <div className='left-button-options'>
                        <button
                          className='bottom-bar-button'
                          onClick={() => copyTextToReview(msg.text)}
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
                  <FeedbackAI
                    conversation_id={conversationId}
                    language={languageSelected}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {conversation.status === 'HOLD ON' && (
        <div className='message-holder'>
          <div className='chat-detail__input-container fade-bottom'>
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
