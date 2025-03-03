import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import authRoutes from "./routes/authRoutes.js";
import { initializeDatabase } from "./config/db.js"; // ✅ default import

dotenv.config();

const app = express();

// ✅ CORS 설정 (프론트엔드 URL 허용)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// ✅ 세션 설정
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // ✅ 로컬 환경에서 문제 방지
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/auth", authRoutes);

// ✅ 데이터베이스 연결 초기화
async function startServer() {
  try {
    await initializeDatabase(); // ✅ DB 초기화 실행
    console.log("✅ 데이터베이스 초기화 완료!");

    // ✅ 라우트 설정
    app.use("/auth", authRoutes);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ 서버 시작 오류:", error);
    process.exit(1);
  }
}

// ✅ 서버 실행
startServer();
