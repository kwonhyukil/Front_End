import express from "express";
import {
  googleLogin,
  googleCallback,
  logout,
  registerUser, // ✅ registerUser 올바르게 import
  getUser,
  refreshToken,
} from "../controllers/authController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Google OAuth 로그인 요청
router.get("/google", googleLogin);

// ✅ Google OAuth 콜백 처리
router.get("/google/callback", googleCallback);

// ✅ 사용자 정보 API (JWT 인증 필수)
router.get("/user", authenticateToken, getUser);

// ✅ 회원가입 API 추가
router.post("/register", registerUser); // ✅ registerUserService가 아니라 registerUser 사용

// JWT 갱신
router.post("/refresh-token", refreshToken);

// ✅ 로그아웃 API
router.get("/logout", logout);

export default router;
