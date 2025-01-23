import { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useWebSocket from '../hook/useWebSocket';
import { STATUS_PENDING } from '../utils/constants';

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const { message, sendMessage, chatFinished, setChatFinished } = useWebSocket(
    'wss://api-staging.mjproapps.com:8081'
  );
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [conversations, setConversations] = useState([]);

  const { t } = useTranslation();

  // Monitoramento de mensagens recebidas via WebSocket
  // Process incoming WebSocket messages
  useEffect(() => {
    if (message) {
      const parsedMessage = JSON.parse(message);
      const { conversationId, text, sender, user, timestamp, language } =
        parsedMessage;

      console.log('parsedMessage ' + parsedMessage);
      if ('type' in parsedMessage) {
        console.log(parsedMessage);
        const { id, status } = parsedMessage;
        setConversations((prevConversations) =>
          prevConversations.map((conv) =>
            conv.id === id ? { ...conv, status } : conv
          )
        );
        return;
      }

      setConversations((prevConversations) => {
        // Check if the conversation already exists
        const existingConversation = prevConversations.find(
          (conv) => conv.id === conversationId
        );

        if (existingConversation) {
          // Avoid adding duplicate messages
          const lastMessage = existingConversation.messages.at(-1);
          if (lastMessage?.text === text && lastMessage?.sender === sender) {
            return prevConversations; // No changes if the message is already present
          }

          // Add the new message to the existing conversation
          return prevConversations.map((conv) =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: [
                    ...conv.messages,
                    { sender, text, timestamp, language },
                  ],
                }
              : conv
          );
        } else {
          // Create a new conversation if it doesn't exist
          const newConversation = {
            id: conversationId,
            title: t('conversation_with', {
              user: user.charAt(0).toUpperCase(),
            }),
            status: STATUS_PENDING,
            user: user,
            messages: [{ sender, text, timestamp, language }],
          };

          return [...prevConversations, newConversation];
        }
      });

      // Show a toast notification
      //toast.info(`New Message Received from ${user}: ${text}`);
    }
  }, [message]);

  return (
    <SocketContext.Provider
      value={{
        sendMessage,
        receivedMessages,
        conversations,
        setConversations,
        chatFinished,
        setChatFinished,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
