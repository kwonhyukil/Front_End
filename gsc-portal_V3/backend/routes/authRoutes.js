import express from "express";
import {
  googleAuth,
  googleAuthCallback,
} from "../controllers/googleAuthController.js";
import { registerUser, loginUser } from "../controllers/authController.js";
import { refreshAccessToken } from "../controllers/tokenController.js";

const router = express.Router();

// ✅ Google OAuth 로그인 요청
router.get("/auth/google", googleAuth);

router.get(
  "/auth/google/callback",
  (req, res, next) => {
    console.log("✅ Google OAuth 콜백 도착");
    next();
  },
  passport.authenticate("google", {
    failureRedirect: "/login?error=OAuth 실패",
  }),
  (req, res) => {
    console.log("✅ Google OAuth 콜백 성공");
    res.redirect("/");
  }
);
// ✅ 회원가입 요청 (승인 대기)
router.post("/auth/register", registerUser);

// ✅ 로그인 (Access Token & Refresh Token 발급)
router.post("/auth/login", loginUser);

// ✅ Access Token 갱신
router.post("/auth/refresh", refreshAccessToken);

export default router;
