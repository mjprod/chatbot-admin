import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import ChatDetail from "../components/ChatDetail";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSocketContext } from "../context/SocketContext";
import "./AdminPanel.css";

function AdminPanel() {
  const [selectedConversationId, setSelectedConversationId] = useState(null); // Selected conversation
  const messagesEndRef = useRef(null);

  // WebSocket hook
  const { conversations, setConversations } = useSocketContext();

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  //TESTER
  useEffect(() => {
    const conversation = {
      id: "85fd05b1-04e2-43cc-a8e5-bcbb6c2c790d",
      title: "Conversation with glauco",
      status: "HOLD ON",
      user: "glauco",
      messages: [
        {
          sender: "bot",
          text: "Hai LuckyPlayer88, bagaimana saya boleh membantu anda?",
        },
        {
          sender: "user",
          text: "Hai, saya perlukan bantuan dengan akaun saya. Saya cuba mengeluarkan kemenangan saya, tetapi transaksi nampaknya tergendala. Boleh anda periksa untuk saya?",
        },
        
        {
          user_input: "Hai, saya perlukan bantuan dengan akaun saya. Saya cuba mengeluarkan kemenangan saya, tetapi transaksi nampaknya tergendala. Boleh anda periksa untuk saya?",
          sender: "bot",
          text: "Transaksi biasanya mengambil masa sehingga 3 hari bekerja, tetapi saya lihat anda sudah pada hari ke-4. Saya akan eskalasi perkara ini kepada pasukan kewangan kami untuk resolusi yang lebih cepat.",
        },
        {
          sender: "user",
          text: "Terima kasih, tetapi ia agak mengecewakan. Saya telah menunggu lebih lama daripada yang dijangkakan. Adakah sebab untuk kelewatan ini?",
        },
        
        {
          sender: "bot",
          text: "Saya benar-benar memahami kekecewaan anda, dan saya mohon maaf atas kelewatan ini. Nampaknya kelewatan disebabkan oleh jumlah transaksi yang tinggi baru-baru ini. Saya akan pastikan kes anda diutamakan. Anda seharusnya menerima kemas kini dalam masa 24 jam.",
        },
        
        {
          sender: "user",
          text: "Baiklah, saya harap begitu. Boleh anda hantar pengesahan sebaik sahaja ia diselesaikan?",
        },
        {
          sender: "bot",
          text: "Sudah tentu! Saya akan pastikan anda dikemas kini melalui emel sebaik sahaja pasukan kewangan memproses permintaan anda. Adakah ada apa-apa lagi yang boleh saya bantu sementara itu?",
        },
        {
          sender: "user",
          text: "Tidak, itu sahaja buat masa ini. Terima kasih atas bantuan anda.",
        },
        {
          sender: "bot",
          text: "Sama-sama! Terima kasih atas kesabaran anda, dan saya akan segera menindaklanjuti perkara ini. Selamat hari! 😊",
        },
      ],
    };
    setConversations((prev) => [...prev, conversation]);
  }, []);

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
      { sender: "admin", text: message },
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

  return (
    <div className="admin-panel">
      {/* Main content */}
      <div className="main-content">
        <div className="chat-detail">
          <ChatDetail
            conversationId={selectedConversationId}
            onSendMessage={handleSendMessage}
          />
        </div>
        <div ref={messagesEndRef} />
      </div>
      {/* Sidebar */}
      <div className="sidebar">
        <Sidebar onSelectConversation={handleSelectConversation} />
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
}

export default AdminPanel;
