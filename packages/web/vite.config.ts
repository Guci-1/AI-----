import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // 前端统一走 /api，代理到后端；SSE 也会经此代理
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
