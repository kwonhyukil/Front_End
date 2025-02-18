import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue"; // Vue 플러그인 추가

export default defineConfig({
  plugins: [vue()], // Vue 플러그인 적용
  server: {
    port: 5173, // 5173 포트 사용
    strictPort: false, // 다른 포트로 변경되지 않도록 설정
    cors: true,
  },
});
