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
      <ul style={{ flex: 1, overflowY: "auto", padding: 0, margin: 0 }}>
        {conversations.map((conversation) => (
          <li className="conversation-item"
            key={conversation.id}
            onClick={() => onSelectConversation(conversation.id)}
            style={{
              backgroundColor:
                conversation.status === "HOLD ON" ? "rgb(23 177 198 / 50%)" : "#dddddd1f",
              transform:
                conversation.status === "HOLD ON" ? "scale(0.95)" : "scale(1)",
            }}
          >
            <div>
              <div style={{ fontWeight: "bold" }}>{conversation.title}</div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {/* Toggle Switch */}
              <label
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <input className="toggle-switch"
                  type="checkbox"
                  checked={conversation.status === "HOLD ON"}
                  onChange={() => handleToggleConversation(conversation.id)}
                />
                <span>{conversation.status === "HOLD ON" ? "Auto Pilot On" : "Auto Pilot Off"}</span>
              </label>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {/* Toggle Switch */}
              <label
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <input
                  type="checkbox"
                  checked={conversation.status === "HOLD ON"}
                  onChange={() => handleToggleConversation(conversation.id)}
                />
                <span>Toggle</span>
              </label>
            </div>
              <div className="sidebar-list-item-status">
                {conversation.status}
              </div>
            </div>
            
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
