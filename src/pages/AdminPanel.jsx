import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ChatDetail from '../components/ChatDetail';
import FiltersConversation from '../components/FiltersConversation';
import Sidebar from '../components/Sidebar';
import { useSocketContext } from '../context/SocketContext';
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
    const conversation = 
      {
        id: "85fd05b1-04e2-43cc-a8e5-bcbb6c2c790d",
        title: "Conversation with glauco",
        status: "pending",
        user: "glauco",
        messages: [
          {
            sender: "bot",
            text: "Hai LuckyPlayer88, bagaimana saya boleh membantu anda?",
            timestamp: "2025-01-21T00:25:00.000Z",
          },
          {
            sender: "user",
            text: "Hai, saya perlukan bantuan dengan akaun saya.",
            timestamp: "2025-01-21T00:27:15.000Z",
          },
        ],
      };
    
    setConversations((prev) => [...prev, conversation]);
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
      { sender: 'admin', text: message },
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
      <div className="admin-panel">
        <div className="main-content">
          <div className="chat-detail">
            {selectedConversationId ? (
              <ChatDetail
                key={String(selectedConversationId)}
                conversationId={selectedConversationId}
                onSendMessage={handleSendMessage}
              />
            ) : (
              <div className="chat-detail__empty">
                <h6>{t('select_conversation_to_view')}</h6>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>
        {/* Sidebar */}
        <div className="sidebar">
          <FiltersConversation
            filters={filters}
            onLanguageSelect={handleLanguageSelect}
          />
          <Sidebar onSelectConversation={handleSelectConversation} />
        </div>
        <ToastContainer position="top-right" autoClose={5000} />
      </div>
    </>
  );
}

export default AdminPanel;
