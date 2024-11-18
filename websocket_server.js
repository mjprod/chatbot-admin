const WebSocket = require("ws");

// Configure the WebSocket server to listen on all interfaces
const server = new WebSocket.Server({ host: "0.0.0.0", port: 8080 });

const clients = []; // List of connected clients

server.on("connection", (socket) => {
  clients.push(socket); // Add the client to the list
  console.log("Client connected!");

  // Receive messages from the client
  socket.on("message", (message) => {
    console.log(`Message received: ${message}`);

    // Send the message to all other clients
    clients.forEach((client) => {
      if (client !== socket && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  // Remove the client when disconnected
  socket.on("close", () => {
    console.log("Client disconnected");
    const index = clients.indexOf(socket);
    if (index !== -1) clients.splice(index, 1);
  });
});

console.log("WebSocket server running at ws://54.206.216.180:8080");
