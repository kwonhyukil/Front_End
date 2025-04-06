// 📄 vite.config.js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
// Vite 설정
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5175, // 프론트엔드 개발 서버 포트
    hmr: {
      protocol: "ws",
      host: "localhost",
      port: 5175,
    },
    proxy: {
      "/auth": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
        ws: true,
        configure: (proxy, options) => {
          proxy.on("proxyReq", (proxyReq, req, res) => {
            console.log("Proxy Request:", req.method, req.url);
          });
          proxy.on("proxyRes", (proxyRes, req, res) => {
            console.log("Proxy Response:", proxyRes.statusCode, req.url);
          });
          proxy.on("error", (err, req, res) => {
            console.error("Proxy Error:", err);
          });
        },
      },
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
});
