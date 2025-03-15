// 📄 authRoutes.js
/*
  ✅ /auth/google - Google 로그인 요청
  ✅ /auth/google/callback - Google 로그인 후 콜백 처리
  ✅ /auth/logout - 로그아웃 처리
*/

import { Router } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { googleConfig } from "../config/googleAuth.js";
import { googleLoginCallback, logout } from "../controllers/authController.js";

const router = Router();

// ✅ 1. Passport를 사용한 Google OAuth2 인증 설정
passport.use(
  new GoogleStrategy(
    googleConfig, // 🔹 Google OAuth 설정 값 (clientID, clientSecret, callbackURL)
    (accessToken, refreshToken, profile, done) => {
      // 🔹 Google에서 인증 성공 후 실행되는 콜백 함수
      //    - `profile`: 사용자 정보 객체 (이메일, 이름 등 포함)
      return done(null, { profile });
    }
  )
);

// ✅ 2. 세션 처리 (선택적 사용)
//    - 필요하면 세션 저장 / 필요 없으면 JWT 방식으로 처리 가능
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// ✅ 3. Google 로그인 요청 엔드포인트
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
//    🔹 사용자가 `/auth/google` 엔드포인트를 요청하면 Google OAuth 로그인 페이지로 리디렉트됨
//    🔹 `scope: ["profile", "email"]` → 사용자 프로필 및 이메일 정보 요청

// ✅ 4. Google 로그인 콜백 엔드포인트
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }), // 🔹 로그인 실패 시 `/`로 리디렉트
  googleLoginCallback // 🔹 로그인 성공 후 `googleLoginCallback` 실행
);

// ✅ 5. 로그아웃 엔드포인트
router.get("/logout", logout); // 🔹 클라이언트가 JWT 토큰을 삭제하면 로그아웃 완료

export default router;
