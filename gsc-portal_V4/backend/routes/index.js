// 📄 index.js
// ✅ 모든 라우트를 통합하여 단일 진입점(Entry Point)으로 관리
import { Router } from "express";
import authRoutes from "./authRoutes.js"; // 🔹 인증 관련 (로그인, 로그아웃)
import userRoutes from "./userRoutes.js"; // 🔹 사용자 정보 조회
import noticeRoutes from "./noticeRoutes.js"; // 🔹 공지사항 CRUD
import scheduleRoutes from "./scheduleRoutes.js"; // 🔹 시간표 CRUD
import adminRoutes from "./adminRoutes.js";

const router = Router();

// ✅ 경로별 라우트 등록
router.use("/auth", authRoutes); // 🔹 /auth 경로 -> authRoutes.js
router.use("/user", userRoutes); // 🔹 /user 경로 -> userRoutes.js
router.use("/notice", noticeRoutes); // 🔹 /notice 경로 -> noticeRoutes.js
router.use("/schedule", scheduleRoutes); // 🔹 /schedule 경로 -> scheduleRoutes.js
router.use("/admin", adminRoutes);

export default router;
