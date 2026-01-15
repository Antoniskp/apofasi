import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import ErrorBoundary from "./ErrorBoundary.jsx";
import { ThemeProvider } from "./lib/ThemeContext.jsx";
import { AuthProvider } from "./lib/AuthContext.jsx";
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <ThemeProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ThemeProvider>
      </MuiThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

