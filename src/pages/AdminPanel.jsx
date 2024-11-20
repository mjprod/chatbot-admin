import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ChatDetail from "../components/ChatDetail";
import { Grid } from "@mui/material";
import useWebSocket from "../hook/useWebSocket";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AdminPanel() {
  const [conversations, setConversations] = useState([]); // Conversations list
  const [selectedConversation, setSelectedConversation] = useState(null); // Selected conversation

  // WebSocket hook
  const { message } = useWebSocket("wss://api-staging.mjproapps.com:8081");

  // Process incoming WebSocket messages
  useEffect(() => {
    if (message) {
      const parsedMessage = JSON.parse(message); // Parse the incoming JSON message
      const { conversationId, text, sender, user } = parsedMessage;

      // Find if the conversation already exists
      const existingConversation = conversations.find(
        (conv) => conv.id === conversationId
      );

      if (existingConversation) {
        // Update the existing conversation with the new message
        const updatedConversations = conversations.map((conv) =>
          conv.id === conversationId
            ? {
                ...conv,
                messages: [...conv.messages, { sender, text }], // Add the new message
              }
            : conv
        );

        setConversations(updatedConversations);
      } else {
        // Create a new conversation if it doesn't exist
        const newConversation = {
          id: conversationId,
          title: `Conversation with ${user}`,
          status: "pending",
          user: user,
          messages: [{ sender, text }],
        };

        setConversations([...conversations, newConversation]);
      }

      // Show a toast notification
      toast.info(`New Message Received from ${user}: ${text}`);
    }
  }, [message, conversations]);

  // Load initial conversations (if you want to pre-load them)
  useEffect(() => {
    // Replace with an API call if needed
    setConversations([]);
  }, []);

  // Handle conversation selection
  const handleSelectConversation = (id) => {
    const conversation = conversations.find((conv) => conv.id === id);
    setSelectedConversation(conversation);
  };

  // Handle sending messages
  const handleSendMessage = (message) => {
    if (!selectedConversation) return;

    const updatedMessages = [
      ...selectedConversation.messages,
      { sender: "admin", text: message },
    ];

    // Update locally
    setSelectedConversation({
      ...selectedConversation,
      messages: updatedMessages,
    });

    // Update the conversation list
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedConversation.id
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
          conversations={conversations}
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
            conversation={selectedConversation}
            onSendMessage={handleSendMessage}
          />
        </div>
      </Grid>
      <ToastContainer position="top-right" autoClose={5000} />
    </Grid>
  );
}

export default AdminPanel;
