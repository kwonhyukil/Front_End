// 📄 userRoutes.js
// ✅ 사용자 관련 API 라우터

import { Router } from "express";
import { authRequired } from "../middleware/authMiddleware.js"; // 🔹 JWT 인증 미들웨어
import { getUserProfile } from "../controllers/userController.js"; // 📌 컨트롤러 연결

const router = Router();

// ✅ 사용자 프로필 조회 (JWT 인증 필요)
// - 로그인된 사용자만 자신의 프로필을 조회할 수 있음
router.get("/profile", authRequired, getUserProfile);

export default router;
