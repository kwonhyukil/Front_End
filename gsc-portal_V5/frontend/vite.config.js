// vite.config.js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5180, // 사용 가능한 포트로 변경
    host: "127.0.0.1", // localhost, 127.0.0.1, ::1 모두 수용
    hmr: {
      protocol: "ws",
    },
  },
  proxy: {
    "/auth": {
      target: "http://localhost:8080",
      changeOrigin: true,
      secure: false,
      ws: true,
    },
    "/api": {
      target: "http://localhost:8080",
      changeOrigin: true,
      secure: false,
      ws: true,
    },
  },
});
