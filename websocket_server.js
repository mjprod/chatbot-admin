const https = require("https");
const fs = require("fs");
const WebSocket = require("ws");

// Paths to your SSL certificate and private key
const SSL_CERT_PATH =
  "/etc/letsencrypt/live/api-staging.mjproapps.com/fullchain.pem"; // Replace with actual path to your certificate
const SSL_KEY_PATH =
  "/etc/letsencrypt/live/api-staging.mjproapps.com/privkey.pem"; // Replace with actual path to your private key

// Create an HTTPS server with SSL credentials
const server = https.createServer({
  cert: fs.readFileSync(SSL_CERT_PATH), // Load SSL certificate
  key: fs.readFileSync(SSL_KEY_PATH), // Load private key
});

// Create a WebSocket server attached to the HTTPS server
const wss = new WebSocket.Server({ server });

// Handle WebSocket connections
wss.on("connection", (socket) => {
  console.log("New client connected");

  // Handle messages from clients
  socket.on("message", (message) => {
    console.log(`Received: ${message}`);
    // Echo the message back to the client
    socket.send(`Server response: ${message}`);
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
    `Secure WebSocket server running on wss://54.206.216.180:${PORT}`
  );
});
