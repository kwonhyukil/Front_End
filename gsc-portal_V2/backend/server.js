import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import http from "http"; // 🔹 Socket.io 추가
import { Server } from "socket.io"; // 🔹 Socket.io 추가

import authRoutes from "./routes/authRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";
import noticesRoutes from "./routes/noticeRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import { initializeDatabase } from "./config/db.js";
import createTables from "./models/dbSetup.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

app.use(
  session({
    secret: "supersecretkey",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());

// 테이블 자동 생성 및 DB 초기화
createTables();
initializeDatabase();

// ✅ 실시간 업데이트 이벤트 적용
io.on("connection", (socket) => {
  console.log("✅ 클라이언트가 연결되었습니다.");
});

// ✅ 라우트 적용
app.use("/auth", authRoutes);
app.use("/schedule", scheduleRoutes(io)); // 🔹 io 객체 전달
app.use("/notices", noticesRoutes);
app.use("/events", eventRoutes);

server.listen(process.env.PORT || 5000, () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
});
