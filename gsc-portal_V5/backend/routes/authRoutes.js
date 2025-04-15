import { Router } from "express";
import passport from "passport";
import { googleStrategy } from "../config/googleAuth.js";
import {
  findUserByEmail,
  createUser,
  saveRefreshToken,
} from "../models/users.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

const router = Router();
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5180";

// 🔐 Google 인증 전략 등록
passport.use(googleStrategy);

// 🍪 쿠키 파서 미들웨어 등록
router.use(cookieParser());

// ✅ Google 로그인 요청 라우터
router.get("/google", (req, res, next) => {
  const dynamicState = Math.random().toString(36).substring(7);
  console.log("📤 Google 인증 요청: state =", dynamicState);

  passport.authenticate("google", {
    scope: ["profile", "email"],
    accessType: "offline",
    prompt: "consent",
    state: dynamicState,
    session: false, // 세션 사용 안 함
  })(req, res, next);
});

// ✅ Google 콜백 처리 라우터
router.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", async (err, user, info) => {
    // ❌ 인증 실패 시 처리
    if (err || !user) {
      console.error("❌ 인증 실패:", err || info);
      return res.redirect(`${FRONTEND_URL}/login?error=authentication_failed`);
    }

    try {
      // ✅ 유저 정보에서 이메일, 이름 추출
      const { email, name } = user;

      // 🔍 DB에서 유저 검색
      let existingUser = await findUserByEmail(email);

      // 👤 유저가 없으면 회원가입 페이지로 리다이렉트
      if (!existingUser) {
        return res.redirect(
          `${FRONTEND_URL}/register?email=${encodeURIComponent(
            email
          )}&name=${encodeURIComponent(name)}`
        );
      }

      // 🔐 Access Token 발급
      const accessToken = jwt.sign(
        {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
          role: existingUser.role_id,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      console.log("✅ AccessToken 발급:", accessToken);
      // 🔐 Refresh Token 발급
      const refreshToken = jwt.sign(
        { id: existingUser.id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
      );
      console.log("✅ RefreshToken 발급:", refreshToken);
      // 💾 Refresh Token을 DB에 저장
      await saveRefreshToken(existingUser.id, refreshToken);

      // 🍪 Refresh Token을 쿠키에 저장
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
      });

      // ✅ 프론트엔드로 Access Token 전달
      res.redirect(`${FRONTEND_URL}/home?accessToken=${accessToken}`);
      console.log(
        "➡️ 리다이렉트 주소:",
        `${FRONTEND_URL}/home?accessToken=${accessToken}`
      );
    } catch (error) {
      console.error("서버 오류 발생:", error);
      res.redirect(`${FRONTEND_URL}/login?error=server_error`);
    }
  })(req, res, next); // 미들웨어 직접 호출 방식
});

// ✅ 로그아웃 시 쿠키 제거
router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken"); // ✅ 브라우저에 저장된 refreshToken 쿠키 제거
  return res.json({ message: "로그아웃 성공" });
});

export default router;
