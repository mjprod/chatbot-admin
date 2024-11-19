const https = require("https");
const fs = require("fs");
const WebSocket = require("ws");

// Paths to your SSL certificate and private key
const SSL_CERT_PATH = "./certs/fullchain.pem"; // Replace with actual path to your certificate
const SSL_KEY_PATH = "./certs/privkey.pem"; // Replace with actual path to your private key

// Create an HTTPS server with SSL credentials
const server = https.createServer({
  cert: fs.readFileSync(SSL_CERT_PATH), // Load SSL certificate
  key: fs.readFileSync(SSL_KEY_PATH), // Load private key
});

// Create a WebSocket server attached to the HTTPS server
const wss = new WebSocket.Server({ server });

// Handle WebSocket connections
  wss.on("connection", (socket) => {
    socket.on("message", (data) => {
      try {
        // Parse the received JSON string
        const message = JSON.parse(data);
        console.log("Received message:", message);
  
        // Process the message or broadcast it
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ ...message, receivedAt: new Date() }));
          }
        });
      } catch (error) {
        console.error("Failed to parse message:", error);
      }
    });
  });

  // Handle client disconnection
  socket.on("close", () => {
    console.log("Client disconnected");
  });
});

// Start the HTTPS server and WebSocket server
const PORT = 8081; // Define the port to listen on
server.listen(PORT, () => {
  console.log(
    `Secure WebSocket server running at wss://api-staging.mjproapps.com:${PORT}`
  );
});
