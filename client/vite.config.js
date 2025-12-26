import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "automatic"
    })
  ],
  resolve: {
    alias: {
      "react-router-dom": path.resolve(__dirname, "src/lib/router.jsx")
    }
  }
});
