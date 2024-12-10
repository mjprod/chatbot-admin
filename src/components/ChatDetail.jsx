import React, { useEffect, useState } from "react";
import { useSocketContext } from "../context/SocketContext";
import { generateTimestamp } from "../utils/timestamp.js";
import "./ChatDetail.css"; // Import the CSS file

function ChatDetail({ conversationId, onSendMessage }) {
  const [message, setMessage] = useState("");
  const [expandedMessageIndex, setExpandedMessageIndex] = useState(null);

  const { sendMessage, conversations } = useSocketContext();
  const conversation = conversations.find((conv) => conv.id === conversationId);

  useEffect(() => {
    if (conversation) {
      console.log("conversation", conversation);
    }
  }, [conversation]);

  const handleSend = () => {
    if (message.trim()) {
      sendMessage(
        JSON.stringify({
          text: message,
          sender: "admin",
          admin_id: "55",
          conversationID: conversation.id,
          user: "admin",
          timestamp: generateTimestamp(),
        })
      );

      onSendMessage(message);
      setMessage("");
    }
  };

  const getIcon = (sender) => {
    switch (sender) {
      case "bot":
        return "🤖";
      case "bot_on_hold":
        return "🛠️";
      case "user":
        return "👤";
      case "admin":
        return "👨‍💻";
      default:
        return "❓";
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

  return (
    <div className="chat-detail-container">
      <div className="chat-detail__messages">
        {conversation.messages.map((msg, index) => {
          if (msg.sender === "bot_on_hold") {
            return (
              <div
                key={index}
                className="chat-detail__message chat-detail__message--bot-on-hold"
              >
                <span className="chat-detail__icon">{getIcon(msg.sender)}</span>
                <div>
                  <p>{msg.text}</p>
                  <button
                    className="chat-detail__expand-btn"
                    onClick={() => handleToggleExpand(index)}
                  >
                    {expandedMessageIndex === index
                      ? "Hide Response"
                      : "Show Response"}
                  </button>
                  {expandedMessageIndex === index && (
                    <div className="chat-detail__expanded-response">
                      <p>{msg.response}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          }

          // Default layout for "bot", "admin", and "user"
          return (
            <div
              key={index}
              className={`chat-detail__message ${
                msg.sender === "bot" ? "chat-detail__message--bot" : ""
              }`}
            >
              <span className="chat-detail__icon">{getIcon(msg.sender)}</span>
              <p>{msg.text}</p>
            </div>
          );
        })}
      </div>

      {conversation.status === "HOLD ON" && (
        <div className="chat-detail__input-container">
          <textarea
            className="chat-detail__textarea"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write a message..."
          />
          <button className="chat-detail__button" onClick={handleSend}>
            <span className="button-chev">› </span>
          </button>
        </div>
      )}
    </div>
  );
}

export default ChatDetail;
