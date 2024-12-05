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
              status: conv.status === "Auto Pilot Off" ? "pending" : "Auto Pilot Off",
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
                conversation.status === "Auto Pilot Off" ? "rgb(23 177 198 / 50%)" : "#dddddd1f",
              transform:
                conversation.status === "Auto Pilot Off" ? "scale(0.95)" : "scale(1)",
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
                  checked={conversation.status === "Auto Pilot Off"}
                  onChange={() => handleToggleConversation(conversation.id)}
                />
                <span>Ai Bot Off</span>
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
