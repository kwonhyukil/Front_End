import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue"; // ✅ Vue 플러그인 추가

export default defineConfig({
  plugins: [vue()], // ✅ 플러그인 등록
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5000", // 백엔드 서버 주소
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
