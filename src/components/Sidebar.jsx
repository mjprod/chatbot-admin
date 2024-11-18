import React from "react";
import { List, ListItem, ListItemText, Typography } from "@mui/material";

function Sidebar({ conversations, onSelectConversation }) {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Typography
        variant="h6"
        style={{
          padding: "16px",
          borderBottom: "1px solid #333", // Ajustado para tema escuro
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
          >
            <ListItemText
              primary={conversation.title}
              secondary={
                conversation.status === "pending" ? "Pending" : "Resolved"
              }
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default Sidebar;
