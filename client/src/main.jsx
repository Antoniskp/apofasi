import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import ErrorBoundary from "./ErrorBoundary.jsx";
import { ThemeProvider as CustomThemeProvider } from "./lib/ThemeContext.jsx";
import { AuthProvider } from "./lib/AuthContext.jsx";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "./theme.js";

// Note: We use both MUI ThemeProvider and custom ThemeProvider
// - MUI ThemeProvider: Provides MUI component styling and theme
// - CustomThemeProvider: Existing app-specific theme context for dark mode toggle
// Both can coexist as they serve different purposes
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <CustomThemeProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </CustomThemeProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

