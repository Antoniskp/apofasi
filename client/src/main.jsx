import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import ErrorBoundary from "./ErrorBoundary.jsx";
import { ThemeProvider } from "./lib/ThemeContext.jsx";
import { AuthProvider } from "./lib/AuthContext.jsx";

const shouldIgnoreExtensionError = (event) => {
  const message = event?.error?.message || event?.message || "";
  const filename = event?.filename || "";
  const isSyntaxError = event?.error instanceof SyntaxError;
  return filename.startsWith("chrome-extension://") && isSyntaxError && message.includes("Unexpected token 'export'");
};

const ExtensionErrorFilter = ({ children }) => {
  React.useEffect(() => {
    const existingOnError = window.onerror;

    window.onerror = (message, source, _lineno, _colno, error) => {
      if (shouldIgnoreExtensionError({ message, filename: source, error })) {
        return true;
      }
      if (typeof existingOnError === "function") {
        return existingOnError(message, source, _lineno, _colno, error);
      }
      return false;
    };

    return () => {
      window.onerror = existingOnError;
    };
  }, []);

  return children;
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ExtensionErrorFilter>
      <ErrorBoundary>
        <ThemeProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </ExtensionErrorFilter>
  </React.StrictMode>
);
