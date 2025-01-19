import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// Define o tema dark
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9", // Azul claro para botões e destaques
    },
    secondary: {
      main: "#f48fb1", // Rosa claro para acentos secundários
    },
    background: {
      default: "#121212", // Fundo principal escuro
      paper: "#1e1e1e", // Fundo de cartões e painéis
    },
    text: {
      primary: "#ffffff", // Texto principal em branco
      secondary: "#b0bec5", // Texto secundário em cinza claro
    },
  },
});


const container = document.getElementById("root");
const root = createRoot(container); // Create a root for your app
root.render(
  <ThemeProvider theme={darkTheme}>
    <CssBaseline /> {/* Reseta estilos globais para aderir ao tema */}
    <App />
  </ThemeProvider>,
  );