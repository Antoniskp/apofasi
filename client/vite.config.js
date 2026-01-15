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
    },
    build: {
      // Optimize bundle splitting for better caching and loading
      rollupOptions: {
        output: {
          manualChunks: {
            // Split MUI into its own chunk for better caching
            // Vite automatically adds content hash to chunk names for cache invalidation
            // e.g., mui-CLgyUEuG.js - hash changes when MUI version updates
            'mui': ['@mui/material', '@emotion/react', '@emotion/styled'],
            // Split React libraries - stable and rarely change
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          },
        },
      },
      // Set chunk size warning limit (500KB default)
      chunkSizeWarningLimit: 600,
      // Enable CSS code splitting
      cssCodeSplit: true,
      // Use esbuild for faster minification (default in Vite 5+)
      minify: 'esbuild',
      // Remove console.log and debugger in production
      esbuild: {
        drop: mode === 'production' ? ['console', 'debugger'] : [],
      },
    },
  };
});
