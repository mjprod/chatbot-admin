import { useEffect, useState } from 'react';

const useWebSocket = (url) => {
  const [message, setMessage] = useState(null);
  const [socket, setSocket] = useState(null);
  const [chatFinished, setChatFinished] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    setSocket(ws);

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = async (event) => {
      const jsonMessage = JSON.parse(event.data);

      if ('type' in jsonMessage) {
        if (jsonMessage.type === 'status_change') {
          console.log(jsonMessage);
          return;
        }

        if (jsonMessage.type === 'status_disconnect') {
          console.log(jsonMessage);
          setChatFinished(jsonMessage.conversationID);
          return;
        }
      }

      if (event.data instanceof Blob) {
        const text = await event.data.text(); // Convert Blob to text
        console.log('Message received (Blob converted to text):', text);
        setMessage(text); // Update state with the converted message
      } else {
        console.log('Message received:', event.data); // For non-Blob messages
        setMessage(event.data); // Update state with the received message
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => ws.close(); // Cleanup on component unmount
  }, [url]);

  const sendMessage = (msg) => {
    console.log(`Received message Admin: ${msg}`);
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(msg);
    }
  };
  return { message, sendMessage, chatFinished, setChatFinished };
};

export default useWebSocket;
