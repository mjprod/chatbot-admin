import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  Box,
  Switch,
  Typography,
} from "@mui/material";
import { useSocketContext } from "../context/SocketContext";
import { generateTimestamp } from "../utils/timestamp.js";

function Sidebar({ onSelectConversation }) {
  const { sendMessage, setConversations, conversations } = useSocketContext();

  const handleToggleConversation = (id) => {
    setConversations((prevConversations) => {
      // Atualiza o status das conversas diretamente no contexto
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

      return updatedConversations;
    });
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Typography
        variant="h6"
        style={{
          padding: "16px",
          borderBottom: "1px solid #333",
        }}
      >
        Conversations
      </Typography>
      <List style={{ flex: 1, overflowY: "auto" }}>
        {conversations.map((conversation) => (
          <ListItem
            button
            key={conversation.id}
            onClick={() => onSelectConversation(conversation.id)}
            style={{
              display: "flex",
              justifyContent: "space-between",
              backgroundColor: conversation.status === "HOLD ON" && "#594141",
              border: "1px solid #ddd",
              marginBottom: "8px",
              borderRadius: "8px",
              padding: "8px",
            }}
          >
            <ListItemText
              primary={conversation.title}
              secondary={conversation.status}
            />

            <Box style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {/* Toggle Switch */}
              <Switch
                edge="end"
                checked={conversation.status === "HOLD ON"}
                onChange={() => handleToggleConversation(conversation.id)}
              />
            </Box>
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default Sidebar;
