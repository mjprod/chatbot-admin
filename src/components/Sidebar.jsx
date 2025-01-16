import React from "react";
import { useSocketContext } from "../context/SocketContext";
import { generateTimestamp } from "../utils/timestamp.js";
import "./Sidebar.css";

function Sidebar({ onSelectConversation }) {
  const { sendMessage, setConversations, conversations } = useSocketContext();

  const handleToggleConversation = (id) => {
    setConversations((prevConversations) => {
      const updatedConversations = prevConversations.map((conv) =>
        conv.id === id
          ? {
              ...conv,
              status: conv.status === "HOLD ON" ? "pending" : "HOLD ON",
            }
          : { ...conv, status: "pending" }
      );

      const updatedConversation = updatedConversations.find(
        (conv) => conv.id === id
      );

      sendMessage(
        JSON.stringify({
          type: "status_change",
          id: updatedConversation.id,
          status: updatedConversation.status,
          timestamp: generateTimestamp(),
        })
      );
      

      sendMessage(
        JSON.stringify({
          text:
            updatedConversation.status === "HOLD ON"
              ? "AI is on by default but you are turning it off"
              : "AI is off by default but you are turning it on",
          sender: "admin",
          conversationID: updatedConversation.id,
          user: "admin",
          admin_id: "55",
          timestamp: generateTimestamp(),
        })
      );

      return updatedConversations;
    });
  };

  return (
    <div className="sidebar-inner">
      <div className="sidebar-title">
        Conversations
      </div>
      <ul className="chat-card-container">
        {conversations.map((conversation) => (
          <li className="conversation-item"
            key={conversation.id}
            onClick={() => onSelectConversation(conversation.id)}
            style={{
              backgroundColor:
                conversation.status === "HOLD ON" ? "rgba(110, 95, 67, 0.4)" : "rgba(148, 148, 148, 0.12)",
              transform:
                conversation.status === "HOLD ON" ? "scale(0.95)" : "scale(1)",
                marginTop:
                conversation.status === "HOLD ON" ? "1rem" : "0.5rem",
                borderLeft:
                conversation.status === "HOLD ON" ? "3px solid #FBE9BC" : "initial",
                paddingLeft:
                conversation.status === "HOLD ON" ? "1.1rem" : "1rem",
                boxShadow:
                conversation.status === "HOLD ON" ? "-3px 7px 5px rgba(24, 24, 24, 0.58) inset, 0 2px 0 rgba(212, 212, 212, 0.24)" : "initial",
            }}
          >
            <div>
              <div style={{ fontWeight: "bold" }}>{conversation.title}</div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {/* Toggle Switch */}
              <label
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
               <input
  className="toggle-switch"
  type="checkbox"
  checked={conversation.status === "HOLD ON"}
  onChange={() => handleToggleConversation(conversation.id)}
/>
                <span>{conversation.status === "HOLD ON" ? "Auto Pilot | Off " : "Auto Pilot | On"}</span>
              </label>
            </div>
          
              <div className="sidebar-list-item-status">
              {conversation.status === "HOLD ON" ? "You have taken Control" : "🤖 Ai is answering…"}
              </div>
            </div>
            
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
