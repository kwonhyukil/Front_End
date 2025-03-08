import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import { initializeDatabase } from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS 설정 (쿠키 X, JWT 사용)
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ 데이터베이스 초기화
initializeDatabase();

// ✅ 인증 라우트 등록
app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
