import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

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

ReactDOM.render(
  <ThemeProvider theme={darkTheme}>
    <CssBaseline /> {/* Reseta estilos globais para aderir ao tema */}
    <App />
  </ThemeProvider>,
  document.getElementById("root")
);
