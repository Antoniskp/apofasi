import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("theme");
        if (stored) {
          return stored;
        }
      } catch (error) {
        // localStorage may be unavailable (private browsing, SSR, etc.)
        console.warn("Could not access localStorage:", error);
      }
      
      // Fall back to prefers-color-scheme
      try {
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
          return "dark";
        }
      } catch (error) {
        console.warn("Could not access matchMedia:", error);
      }
    }
    
    return "light";
  });

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute("data-theme", theme);
    
    // Persist to localStorage
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("theme", theme);
      } catch (error) {
        // localStorage may be unavailable
        console.warn("Could not save theme to localStorage:", error);
      }
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
