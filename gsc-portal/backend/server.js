import express from "express";
import session from "express-session";
import passport from "./config/passport.js";
import authRoutes from "./routes/auth.js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ✅ CORS 설정 (프론트엔드 URL 허용)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ✅ 세션 설정
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// ✅ Passport 초기화
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

// ✅ 라우트 설정
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
