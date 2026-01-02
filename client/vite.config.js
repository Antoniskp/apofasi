import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiTarget = env.VITE_API_BASE_URL || "http://localhost:5000";

  return {
    plugins: [
      react({
        jsxRuntime: "automatic"
      })
    ],
    resolve: {
      alias: {
        "react-router-dom": path.resolve(__dirname, "src/lib/router.jsx")
      }
    },
    server: {
      fs: {
        allow: [path.resolve(__dirname, "..")],
      },
      proxy: {
        "/auth": {
          target: apiTarget,
          changeOrigin: true,
          secure: false
        }
      }
    }
  };
});
