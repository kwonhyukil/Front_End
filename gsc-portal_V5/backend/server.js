// 📁 [경로: backend/server.js]
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import dotenv from "dotenv";

dotenv.config();

const { PORT = 8080, FRONTEND_URL } = process.env;
const app = express();

// ✅ CORS 설정
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Authorization"],
  })
);

// ✅ Body 파서
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ 쿠키 파서 (RefreshToken 쿠키용)
app.use(cookieParser());

// ✅ 정적 폴더 (업로드용)
app.use("/uploads", express.static("uploads"));

// ✅ API 라우터
app.use("/api", router);

// ✅ 에러 핸들링 미들웨어
app.use(errorHandler);

// ✅ 헬스 체크
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// ✅ 서버 실행
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
  console.log(`프론트엔드 URL: ${FRONTEND_URL}`);
});
