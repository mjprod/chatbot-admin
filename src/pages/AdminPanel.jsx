import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import ChatDetail from "../components/ChatDetail";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSocketContext } from "../context/SocketContext";
import "./AdminPanel.css";

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

  //TESTER
  useEffect(() => {
    const conversation = {
      id: "85fd05b1-04e2-43cc-a8e5-bcbb6c2c790d",
      title: "Conversation with glauco",
      status: "HOLD ON",
      user: "glauco",
      messages: [
        {
          sender: "bot",
          text: "Hey Glauco, how can I help you?",
        },
        {
          sender: "user",
          text: "dfd",
        },
        {
          user_input: "dfd",
          sender: "bot_on_hold",
          text: `English
- Dear Player,

I am your gaming and gambling platform assistant, here to provide you with precise information and support. How may I assist you today?

Malay
- Pemain yang dihormati,

Saya adalah pembantu platform permainan dan perjudian anda, di sini untuk memberikan maklumat dan sokongan yang tepat. Bagaimana saya boleh membantu anda hari ini?

Chinese
- 亲爱的玩家，

我是您的游戏和博彩平台助手，随时为您提供准确的信息和支持。请问今天有什么可以帮助您的吗？`,
        },
        {
          sender: "admin",
          text: "how?",
        },
      ],
    };
    setConversations((prev) => [...prev, conversation]);
  }, []);

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
      {/* Sidebar */}
      <div className="sidebar">
        <Sidebar onSelectConversation={handleSelectConversation} />
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
}

export default AdminPanel;
