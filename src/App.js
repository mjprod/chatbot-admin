import React, { useState } from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import AdminPanel from "./pages/AdminPanel";
import Notifications from "@mui/icons-material/Notifications";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { Box, IconButton } from "@mui/material";
import { AuthContextProvider } from "./context/AuthContext";
import { SocketContextProvider } from "./context/SocketContext";

function App() {
  const [themeMode, setThemeMode] = useState("dark"); // Tema padrão: escuro

  // Função para alternar o tema
  const toggleTheme = () => {
    setThemeMode((prevMode) => (prevMode === "dark" ? "light" : "dark"));
  };

  // Configuração do tema dinâmico
  const theme = createTheme({
    palette: {
      mode: themeMode,
      primary: {
        main: "#90caf9",
      },
      secondary: {
        main: "#f48fb1",
      },
      background: {
        default: themeMode === "dark" ? "#121212" : "#f5f5f5",
        paper: themeMode === "dark" ? "#1e1e1e" : "#ffffff",
      },
      text: {
        primary: themeMode === "dark" ? "#ffffff" : "#000000",
        secondary: themeMode === "dark" ? "#b0bec5" : "#757575",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* <Box
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px",
          borderBottom: `1px solid ${themeMode === "dark" ? "#333" : "#ddd"}`,
          background: theme.palette.background.paper,
        }}
      >
        <Box display="flex" alignItems="center">
          <IconButton>
            <Notifications color="primary" />
          </IconButton>
        </Box>
        <IconButton onClick={toggleTheme}>
          {themeMode === "dark" ? (
            <LightModeIcon color="primary" />
          ) : (
            <DarkModeIcon color="secondary" />
          )}
        </IconButton>
      </Box>*/}
      <AuthContextProvider>
        <SocketContextProvider>
          <AdminPanel />
        </SocketContextProvider>
      </AuthContextProvider>
    </ThemeProvider>
  );
}

export default App;
