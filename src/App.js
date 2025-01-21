import React from 'react';
import AdminPanel from './pages/AdminPanel';
import { AuthContextProvider } from './context/AuthContext';
import { SocketContextProvider } from './context/SocketContext';

function App() {
  return (
    <AuthContextProvider>
      <SocketContextProvider>
        <AdminPanel />
      </SocketContextProvider>
    </AuthContextProvider>
  );
}

export default App;
