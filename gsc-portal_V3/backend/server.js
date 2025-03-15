import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";
import session from "express-session";
import authRoutes from "./routes/authRoutes.js";
import "./config/passport.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// ✅ `authRoutes.js`의 경로를 등록
app.use("/api", authRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log(`🚀 서버 실행 중: http://localhost:${process.env.PORT || 5000}`);
});
