// 📄 vite.config.js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
// Vite 설정
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5174, // 프론트엔드 개발 서버 포트
  },
});
