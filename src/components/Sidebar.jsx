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
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div
        style={{
          padding: "16px",
          borderBottom: "1px solid #333",
          fontSize: "18px",
          fontWeight: "bold",
        }}
      >
        Conversations
      </div>
      <ul style={{ flex: 1, overflowY: "auto", padding: 0, margin: 0 }}>
        {conversations.map((conversation) => (
          <li
            key={conversation.id}
            onClick={() => onSelectConversation(conversation.id)}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor:
                conversation.status === "HOLD ON" ? "#594141" : "#fff",
              border: "1px solid #ddd",
              marginBottom: "8px",
              borderRadius: "8px",
              padding: "8px",
              cursor: "pointer",
              listStyleType: "none",
            }}
          >
            <div>
              <div style={{ fontWeight: "bold" }}>{conversation.title}</div>
              <div style={{ fontSize: "12px", color: "#666" }}>
                {conversation.status}
              </div>
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
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
