import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import ErrorBoundary from "./ErrorBoundary.jsx";
import { ThemeProvider } from "./lib/ThemeContext.jsx";
import { AuthProvider } from "./lib/AuthContext.jsx";

const shouldIgnoreExtensionError = (event) => {
  const message = event?.message || "";
  const filename = event?.filename || "";
  return filename.startsWith("chrome-extension://") && message.includes("Unexpected token 'export'");
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

window.addEventListener(
  "error",
  (event) => {
    if (shouldIgnoreExtensionError(event)) {
      if (event.cancelable) {
        event.preventDefault();
      }
      event.stopImmediatePropagation();
    }
  },
  true
);
