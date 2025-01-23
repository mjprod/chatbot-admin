import { useMemo, useState } from 'react';
import { useSocketContext } from '../context/SocketContext';
import { generateTimestamp } from '../utils/timestamp.js';
import CardConversations from './CardConversations';
import './Sidebar.css';
import SideBarMessagesHeader from './SideBarMessagesHeader';
import SidebarPagination from './SidebarPagination';

function Sidebar({ onSelectConversation }) {
  const { sendMessage, setConversations, conversations } = useSocketContext();

  const [filterText, setFilterText] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [sortOrderHold, setSortHold] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  const filteredConversations = useMemo(() => {
    const filtered = conversations.filter((conversation) => {
      const textMatch =
        conversation.id?.toLowerCase().includes(filterText.toLowerCase()) ||
        conversation.user?.toLowerCase().includes(filterText.toLowerCase());

      const statusMatch = conversation.status
        .toLowerCase()
        .includes(filterStatus.toLowerCase());

      return textMatch && statusMatch;
    });

    const sorted = filtered
      .map((conversation) => {
        const lastMessage = conversation.messages.reduce((latest, message) => {
          return new Date(message.timestamp) > new Date(latest.timestamp)
            ? message
            : latest;
        }, conversation.messages[0]);

        return {
          ...conversation,
          lastMessage,
        };
      })
      .sort((a, b) => {
        if (sortOrderHold) {
          // Prioritize "HOLD ON" status
          if (a.status === 'HOLD ON' && b.status !== 'HOLD ON') return -1;
          if (b.status === 'HOLD ON' && a.status !== 'HOLD ON') return 1;
        }

        // Then sort by timestamp of last message
        const dateA = new Date(a.lastMessage?.timestamp || 0);
        const dateB = new Date(b.lastMessage?.timestamp || 0);
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
      });

    return sorted;
  }, [conversations, filterText, filterStatus, sortOrder]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredConversations.length / itemsPerPage);
  }, [filteredConversations]);

  const paginatedConversations = useMemo(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredConversations.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredConversations, currentPage, totalPages]);

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
    <div className='sidebar-inner'>
      <SideBarMessagesHeader
        setSortOrder={setSortOrder}
        setSortHold={setSortHold}
        setFilterText={setFilterText}
      />
      <ul className='chat-card-container'>
        {paginatedConversations.map((conversation) => (
          <CardConversations
            key={conversation.id}
            conversation={conversation}
            onSelectConversation={() => onSelectConversation(conversation.id)}
            handleToggleConversation={() =>
              handleToggleConversation(conversation.id)
            }
          />
        ))}
      </ul>
      <div className="scroll-fader"></div>
      <SidebarPagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
    </div>
  );
}

export default Sidebar;
