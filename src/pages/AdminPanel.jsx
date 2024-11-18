import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ChatDetail from "../components/ChatDetail";
import data from "../json/data.json"; // Import JSON
import { Grid } from "@mui/material";

function AdminPanel() {
  const [conversations, setConversations] = useState([]); // Conversations list
  const [selectedConversation, setSelectedConversation] = useState(null); // Selected conversation

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
    </Grid>
  );
}

export default AdminPanel;
