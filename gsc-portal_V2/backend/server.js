import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";
import noticesRoutes from "./routes/noticeRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import { initializeDatabase } from "./config/db.js";
import createTables from "./models/dbSetup.js";
import session from "express-session"; // ✅ express-session 추가

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ 세션 설정 (Google 캘린더 Access Token 저장용)
app.use(
  session({
    secret: "supersecretkey",
    resave: false,
    saveUninitialized: true,
  })
);

// ✅ CORS 설정
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
// app.use("/calendar", calendarRoutes); // ✅ Google 캘린더 관련 API 추가

// 서버 실행시 테이블 자동 생성
createTables();
// ✅ 데이터베이스 초기화
initializeDatabase();

// ✅ 인증 라우트
app.use("/auth", authRoutes);

// ✅ 시간표 라우트
app.use("/schedule", scheduleRoutes);

// ✅ 공지사항 라우트
app.use("/notices", noticesRoutes);

// ✅ 학과 일정 라우트
app.use("/events", eventRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
