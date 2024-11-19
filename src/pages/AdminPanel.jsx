import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ChatDetail from "../components/ChatDetail";
import data from "../json/data.json"; // Import JSON
import { Grid } from "@mui/material";
import useWebSocket from "../hook/useWebSocket";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AdminPanel() {
  const [conversations, setConversations] = useState([]); // Conversations list
  const [selectedConversation, setSelectedConversation] = useState(null); // Selected conversation

  const { message } = useWebSocket("wss://54.206.216.180:8081");

  useEffect(() => {
    if (message) {
      // Show a toast notification when a new message is received
      toast.info(`New Message Received: ${message}`);
    }
  }, [message]);

  useEffect(() => {
    // Load conversations from the JSON file
    setConversations(data.conversations);
  }, []);

  const handleSelectConversation = (id) => {
    const conversation = conversations.find((conv) => conv.id === id);
    setSelectedConversation(conversation);
  };

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
