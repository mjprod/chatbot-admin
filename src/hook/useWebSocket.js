import { useEffect, useState } from "react";

const useWebSocket = (url) => {
  const [message, setMessage] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    setSocket(ws);

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    //ws.onmessage = (event) => {
    //console.log("Message received:", event.data);
    //setMessage(event.data); // Update with received message
    //};
    ws.onmessage = async (event) => {
      if (event.data instanceof Blob) {
        const text = await event.data.text(); // Convert Blob to text
        console.log("Message received (Blob converted to text):", text);
        setMessage(text); // Update state with the converted message
      } else {
        console.log("Message received:", event.data); // For non-Blob messages
        setMessage(event.data); // Update state with the received message
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => ws.close(); // Cleanup on component unmount
  }, [url]);

  const sendMessage = (msg) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(msg);
    }
  };

  return { message, sendMessage };
};

export default useWebSocket;
