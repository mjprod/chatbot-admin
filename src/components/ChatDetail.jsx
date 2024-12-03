import React, { useEffect, useState } from "react";
import { Typography, TextField, Button, Box } from "@mui/material";
import { useSocketContext } from "../context/SocketContext";

function ChatDetail({ conversationId, onSendMessage }) {
  const [message, setMessage] = useState("");

  const { sendMessage, conversations } = useSocketContext();

  const conversation = conversations.find((conv) => conv.id === conversationId);

  useEffect(() => {
    if (conversation) {
      console.log("SEU" + conversation);
    }
  }, [conversation]);

  const handleSend = () => {
    if (message.trim()) {
      sendMessage(
        JSON.stringify({
          text: message,
          sender: "admin",
          conversationId: conversation.id,
          user: "admin",
        })
      );

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
              color: msg.sender === "bot" ? "#90caf9" : "#ffffff",
            }}
          >
            <span style={{ marginRight: "8px" }}>{getIcon(msg.sender)}</span>
            <Typography variant="body1">{msg.text}</Typography>
          </Box>
        ))}
      </Box>

      {conversation.status === "HOLD ON" && (
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
      )}
    </Box>
  );
}

export default ChatDetail;
