import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ChatDetail from '../components/ChatDetail';
import ChatEmptyState from '../components/ChatEmptyState';
import Sidebar from '../components/Sidebar';
import { useSocketContext } from '../context/SocketContext';
import { SENDER_ADMIN } from '../utils/constants';
import './AdminPanel.css';

function AdminPanel() {
  const { t } = useTranslation();

  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [filters, setFilters] = useState('en');

  const messagesEndRef = useRef(null);

  const { conversations, setConversations } = useSocketContext();

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  //TESTER
  useEffect(() => {
    //setConversations((prev) => [...prev, conversation1]);
    //setConversations((prev) => [...prev, conversation2]);
    //setConversations((prev) => [...prev, conversation3]);
    //setConversations((prev) => [...prev, conversation1]);
    //setConversations((prev) => [...prev, conversation2]);
    //setConversations((prev) => [...prev, conversation3]);
    //setConversations((prev) => [...prev, conversation4]);
    //setConversations((prev) => [...prev, conversation5]);
    //setConversations((prev) => [...prev, conversation6]);
  }, [setConversations]);

  useEffect(() => {
    scrollToBottom();
    console.log(conversations);
  }, [conversations]);

  const conversation = conversations.find(
    (conv) => conv.id === selectedConversationId
  );

  // Handle conversation selection
  const handleSelectConversation = (id) => {
    const conversation = conversations.find((conv) => conv.id === id);
    setSelectedConversationId(conversation.id);
  };

  // Handle sending messages
  const handleSendMessage = (message) => {
    if (!selectedConversationId) return;

    const updatedMessages = [
      ...conversation.messages,
      {
        sender: SENDER_ADMIN,
        text: message,
        timestamp: new Date().toISOString(),
      },
    ];

    // Update locally
    setSelectedConversationId(
      selectedConversationId
      //messages: updatedMessages,
    );

    // Update the conversation list
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedConversationId
          ? { ...conv, messages: updatedMessages }
          : conv
      )
    );
  };

  const handleLanguageSelect = (language) => {
    setFilters(language);
    console.log(`Language selected: ${language}`);
  };

  return (
    <>
      <div className='admin-panel'>
        <div className='main-content'>
          <div className='chat-detail'>
            {selectedConversationId ? (
              <ChatDetail
                conversationId={selectedConversationId}
                onSendMessage={handleSendMessage}
              />
            ) : (
              <ChatEmptyState />
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>
        {/* Sidebar */}
        <div className='sidebar'>
          <Sidebar onSelectConversation={handleSelectConversation} />
        </div>
        <ToastContainer position='top-right' autoClose={5000} />
      </div>
    </>
  );
}

export default AdminPanel;
