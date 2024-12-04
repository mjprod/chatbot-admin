import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import ChatDetail from "../components/ChatDetail";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSocketContext } from "../context/SocketContext";

function AdminPanel() {
  const [selectedConversationId, setSelectedConversationId] = useState(null); // Selected conversation
  const messagesEndRef = useRef(null);

  // WebSocket hook
  const { conversations, setConversations } = useSocketContext();

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
    console.log(conversations);
  }, [conversations]);

  const conversation = conversations.find(
    (conv) => conv.id === selectedConversationId
  );

  // Handle conversation selection
  const handleSelectConversation = (id) => {
    const conversation = conversations.find((conv) => conv.id === id);
    setSelectedConversationId(conversation.id);
  };

  // Handle sending messages
  const handleSendMessage = (message) => {
    if (!selectedConversationId) return;

    const updatedMessages = [
      ...conversation.messages,
      { sender: "admin", text: message },
    ];

    // Update locally
    setSelectedConversationId(
      selectedConversationId
      //messages: updatedMessages,
    );

    // Update the conversation list
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedConversationId
          ? { ...conv, messages: updatedMessages }
          : conv
      )
    );
  };

  return (
    <div className="admin-panel">
      {/* Sidebar */}
      <div className="sidebar">
        <Sidebar onSelectConversation={handleSelectConversation} />
      </div>

      {/* Main content */}
      <div className="main-content">
        <div className="chat-detail">
          <ChatDetail
            conversationId={selectedConversationId}
            onSendMessage={handleSendMessage}
          />
        </div>
        <div ref={messagesEndRef} />
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
}

export default AdminPanel;
