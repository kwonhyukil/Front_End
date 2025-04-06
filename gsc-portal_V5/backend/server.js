// [경로: backend/server.js]
import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import router from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import "./config/dotenv.js";
import authRoutes from "./routes/authRoutes.js";
import dotenv from "dotenv";

dotenv.config();

const { PORT = 8080, FRONTEND_URL, SESSION_SECRET } = process.env;

const app = express();

console.log("서버 설정:", {
  PORT,
  FRONTEND_URL,
  NODE_ENV: process.env.NODE_ENV,
});

// CORS 설정
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
  })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// uploads 폴더 정적 제공
app.use("/uploads", express.static("uploads"));

// 세션 설정
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
      domain: "localhost",
    },
  })
);

// Passport 초기화
app.use(passport.initialize());
app.use(passport.session());

// 디버깅 미들웨어
app.use((req, res, next) => {
  console.log("요청 정보:", {
    url: req.url,
    method: req.method,
    origin: req.headers.origin,
    cookie: req.headers.cookie,
    sessionID: req.sessionID,
    isAuthenticated: req.isAuthenticated(),
  });
  next();
});

// 라우트
app.get("/", (req, res) => {
  res.send("GSC 포털 백엔드 API");
});

// API 라우트
app.use("/auth", authRoutes);
app.use("/api", router);

// 에러 핸들링
app.use((err, req, res, next) => {
  console.error("서버 에러:", err);
  res.status(500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// 상태 확인 라우트
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// 실행
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
  console.log(`프론트엔드 URL: ${FRONTEND_URL}`);
});
