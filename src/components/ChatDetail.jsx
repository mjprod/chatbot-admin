import React, { useState } from "react";
import { Typography, TextField, Button, Box } from "@mui/material";

function ChatDetail({ conversation, onSendMessage }) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const getIcon = (sender) => {
    switch (sender) {
      case "bot":
        return "🤖";
      case "user":
        return "👤";
      case "admin":
        return "👨‍💻";
      default:
        return "❓";
    }
  };

  if (!conversation) {
    return (
      <Box style={{ textAlign: "center", marginTop: "50px" }}>
        <Typography variant="h6">
          Select a conversation to view details.
        </Typography>
      </Box>
    );
  }

  return (
    <Box style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box style={{ flex: 1, overflowY: "auto", paddingBottom: "16px" }}>
        {conversation.messages.map((msg, index) => (
          <Box
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "8px",
              color: msg.sender === "bot" ? "#90caf9" : "#ffffff", // Ajuste para bot
            }}
          >
            <span style={{ marginRight: "8px" }}>{getIcon(msg.sender)}</span>
            <Typography variant="body1">{msg.text}</Typography>
          </Box>
        ))}
      </Box>
      <Box style={{ borderTop: "1px solid #333", paddingTop: "16px" }}>
        <TextField
          fullWidth
          multiline
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write a message..."
          variant="outlined"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSend}
          style={{ marginTop: "8px" }}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
}

export default ChatDetail;
