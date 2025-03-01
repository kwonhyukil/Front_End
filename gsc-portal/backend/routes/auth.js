import express from "express";
import {
  googleLogin,
  googleCallback,
  logout,
  getUser,
} from "../controllers/authController.js";

const router = express.Router();

// 로그인된 사용자 정보 API
router.get("/user", getUser);

// ✅ Google OAuth 로그인 요청
router.get("/google", googleLogin);

// ✅ Google OAuth 콜백 처리
router.get("/google/callback", googleCallback);

router.get("/user", (req, res) => {
  if (req.user) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ error: "unauthorized " });
  }
});

// ✅ 로그아웃 API
router.get("/logout", logout);

export default router;
