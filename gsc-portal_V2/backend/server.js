// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";

import { initializeDatabase } from "./config/db.js";
import createTables from "./models/dbSetup.js";

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import calendarRoutes from "./routes/calendarRoutes.js";
import noticeRoutes from "./routes/noticeRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ 세션 (구글캘린더 Access Token 임시 저장)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ DB 초기화
initializeDatabase();
createTables();

// ✅ 라우트 등록
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/calendar", calendarRoutes);
app.use("/notices", noticeRoutes);
app.use("/events", eventRoutes);
app.use("/schedule", scheduleRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
