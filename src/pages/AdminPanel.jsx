import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import ChatDetail from "../components/ChatDetail";
import { Grid2 as Grid } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
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
    <Grid
      container
      style={{ height: "calc(100vh - 64px)", overflow: "hidden" }}
    >
      {/* Sidebar */}
      <Grid
        item
        xs={3}
        style={{
          backgroundColor: "inherit",
          borderRight: "1px solid #ddd",
          overflowY: "auto",
        }}
      >
        <Sidebar
          //conversations={conversations.map((conversation) => ({
          //...conversation,
          //id:
          //  conversation.id || `${conversation.title}-${conversation.status}`,
          //}))}
          onSelectConversation={handleSelectConversation}
        />
      </Grid>

      {/* Main content */}
      <Grid
        item
        xs={9}
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "inherit",
        }}
      >
        <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
          <ChatDetail
            conversationId={selectedConversationId}
            onSendMessage={handleSendMessage}
          />
        </div>
        <div ref={messagesEndRef} />
      </Grid>
      <ToastContainer position="top-right" autoClose={5000} />
    </Grid>
  );
}

export default AdminPanel;
