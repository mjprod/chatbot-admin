import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useSocketContext } from '../context/SocketContext';
import { generateTimestamp } from '../utils/timestamp.js';
import './ChatDetail.css';
import ChatHeader from './ChatHeader.jsx';
import Feedback from './Feedback.jsx';
import FeedbackAI from './FeedbackAi.jsx';
import { ReactComponent as SendSvg } from '../assets/iconSend.svg';
import { ReactComponent as AttachSvg } from '../assets/iconAttachment.svg';
import { ReactComponent as IconThreeDots } from '../assets/IconThreeDots.svg';
import { ReactComponent as AddtoMessage } from '../assets/IconAddtoMessage.svg';
import { ReactComponent as IconThumbsDown } from '../assets/IconThumbsDown.svg';
import { ReactComponent as IconAutoSend } from '../assets/IconAutoSend.svg';

const ChatDetail = ({ conversationId, onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [expandedMessageIndex, setExpandedMessageIndex] = useState(null);

  const { sendMessage, conversations } = useSocketContext();
  const conversation = conversations.find((conv) => conv.id === conversationId);
  const [visibleDivs, setVisibleDivs] = useState({});

  useEffect(() => {
    if (conversation) {
      console.log('conversation', conversation);
    }
  }, [conversation]);

  const handleSend = () => {
    if (message.trim()) {
      sendMessage(
        JSON.stringify({
          text: message,
          sender: 'admin',
          admin_id: '55',
          conversationID: conversation.id,
          user: 'admin',
          timestamp: generateTimestamp(),
        })
      );

      onSendMessage(message);
      setMessage('');
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
      <div className="chat-detail__empty">
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

  return (
    <div key={conversationId} className="chat-detail-container">
      <ChatHeader
        conversation={conversation}
      />
      <div className="chat-detail__messages">
        {conversation.messages.map((msg, index) => {
          const key = msg.id || `${conversationId}-message-${index}`;
          if (msg.sender === 'bot_on_hold') {
            return (
              <div
                key={key}
                className="chat-detail__message chat-detail__message--bot-on-hold"
              >
                <span className="chat-detail__icon">{getIcon(msg.sender)}</span>
                <div>
                  <p>{msg.user_input}</p>
                  <button
                    className="chat-detail__expand-btn"
                    onClick={() => handleToggleExpand(index)}
                  >
                    {expandedMessageIndex === index
                      ? 'Hide Response'
                      : 'Show Response'}
                  </button>
                  {expandedMessageIndex === index && (
                    <>
                      <div className="chat-detail__expanded-response">
                        <p>{msg.text}</p>
                      </div>
                      {
                        <Feedback
                          onLike={() => {
                            //const updatedMessages = [...messages];
                            //updatedMessages[index] = {
                            //...msg,
                            //feedback: "liked",
                            //};
                            //setMessages(updatedMessages);
                          }}
                          onDislike={() => {
                            //const updatedMessages = [...messages];
                            //updatedMessages[index] = {
                            //...msg,
                            //feedback: "disliked",
                            //};
                            //setMessages(updatedMessages);
                          }}
                          onClearThumbs={() => {
                            //const updatedMessages = [...messages];
                            //updatedMessages[index] = { ...msg, feedback: "" };
                            //setMessages(updatedMessages);
                          }}
                          //lastMessage={lastMessage}
                          //aiAnswer={aiAnswer}
                          //language={selectedLanguages}
                          //chatBodyRef={chatBodyRef}
                          conversation_id={conversationId}
                        />
                      }
                    </>
                  )}
                </div>
              </div>
            );
          }

          return (
            <div key={conversationId} className="chat-container">
              <div
                key={index}
                className={`chat-detail__message--${msg.sender}`}
              >
                <span className="chat-detail__icon">{getIcon(msg.sender)}</span>
                <p>{msg.text}</p>
              </div>

              {msg.sender === 'bot' && index > 0 && (
                <div className="fade-div fade-in">
                  <div className="bottom-bar">
                    <div className="left-buttons">
                      <IconThreeDots className="icon-threedots" />
                      <div className="left-button-options">
                        <button className="bottom-bar-button">
                          <AddtoMessage className="icon-addtomessage" /></button>
                          <div className="seperator-line">.</div>
                        <button
                          className="bottom-bar-button"
                          onClick={() => toggleDivVisibility(index)}
                        >
                          <IconThumbsDown className="icon-thumbsdown" />
                        </button></div>
                    </div>
                    <div className="right-buttons">
                      <button className="bottom-bar-button"><IconAutoSend className="icon-auto-send" /></button>
                    </div>
                  </div>
                </div>
              )}
              {/* Fading Div */}
              {visibleDivs[index] && (
                <div className="fade-div fade-in">
                  <FeedbackAI />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {conversation.status === 'HOLD ON' && (
        <div className="chat-detail__input-container">
          <textarea
            className="chat-detail__textarea"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write a message..."
          />
          <div className="chatinputbutton-container">
            <button className="chat-detail__button_attachment" onClick={handleSend}>
              <span className="button-chev"><AttachSvg className="icon-attachsvg" /> </span>
            </button>
            <button className="chat-detail__button" onClick={handleSend}>
              <span className="button-chev"><SendSvg className="icon-sendsvg" />  </span>
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
