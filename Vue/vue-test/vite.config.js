import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5174, // 사용할 포트 번호 (5174, 3000 등으로 변경 가능)
  },
});
