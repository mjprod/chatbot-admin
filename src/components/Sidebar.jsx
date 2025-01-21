import { useState } from 'react';
import { useSocketContext } from '../context/SocketContext';
import { generateTimestamp } from '../utils/timestamp.js';
import CardConversations from './CardConversations';
import './Sidebar.css';
import SideBarMessagesHeader from './SideBarMessagesHeader';
import SidebarPagination from './SidebarPagination';

function Sidebar({ onSelectConversation }) {
  const { sendMessage, setConversations, conversations } = useSocketContext();

  const [filterText, setFilterText] = useState(''); // For search
  const [filterStatus, setFilterStatus] = useState(''); // For status filtering
  const [currentPage, setCurrentPage] = useState(1); // For pagination

  const itemsPerPage = 4;
  const totalPages = Math.ceil(conversations.length / itemsPerPage);

  // Filter conversations based on text and status
  const filteredConversations = conversations.filter((conversation) => {
    const matchesText = conversation.title
      .toLowerCase()
      .includes(filterText.toLowerCase());
    const matchesStatus = filterStatus
      ? conversation.status === filterStatus
      : true;
    return matchesText && matchesStatus;
  });

  // Calculate paginated conversations
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedConversations = filteredConversations.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleToggleConversation = (id) => {
    setConversations((prevConversations) => {
      const updatedConversations = prevConversations.map((conv) =>
        conv.id === id
          ? {
              ...conv,
              status: conv.status === 'HOLD ON' ? 'pending' : 'HOLD ON',
            }
          : { ...conv, status: 'pending' }
      );

      const updatedConversation = updatedConversations.find(
        (conv) => conv.id === id
      );

      sendMessage(
        JSON.stringify({
          type: 'status_change',
          id: updatedConversation.id,
          status: updatedConversation.status,
          timestamp: generateTimestamp(),
        })
      );

      sendMessage(
        JSON.stringify({
          text:
            updatedConversation.status === 'HOLD ON'
              ? 'AI is on by default but you are turning it off'
              : 'AI is off by default but you are turning it on',
          sender: 'admin',
          conversationID: updatedConversation.id,
          user: 'admin',
          admin_id: '55',
          timestamp: generateTimestamp(),
        })
      );

      return updatedConversations;
    });
  };

  return (
    <div className="sidebar-inner">
      <SideBarMessagesHeader />
      <ul className="chat-card-container">
        {paginatedConversations.map((conversation,index) => (
          <CardConversations key={index} conversation={conversation}  
            onSelectConversation={() => onSelectConversation(conversation.id)}
            handleToggleConversation={() => handleToggleConversation(conversation.id)}/>
          ))}
      </ul>
      <SidebarPagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
    </div>
  );
}

export default Sidebar;
