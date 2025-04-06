// [경로: backend/routes/authRoutes.js]
import { Router } from "express";
import passport from "passport";
import { googleConfig, googleStrategy } from "../config/googleAuth.js";

const router = Router();
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5175";

console.log("Google OAuth 설정:", {
  ...googleConfig,
  clientSecret: "***", // 보안을 위해 시크릿은 숨김
});

// Passport Google 전략 설정
passport.use(googleStrategy);

// 세션 직렬화
passport.serializeUser((user, done) => {
  console.log("Serializing user:", user);
  done(null, user);
});

// 세션 역직렬화
passport.deserializeUser((obj, done) => {
  console.log("Deserializing user:", obj);
  done(null, obj);
});

// Google 로그인 시작
router.get(
  "/google",
  (req, res, next) => {
    console.log("Google 로그인 시작:", {
      sessionID: req.sessionID,
      isAuthenticated: req.isAuthenticated(),
    });
    next();
  },
  passport.authenticate("google", {
    scope: ["profile", "email"],
    accessType: "offline",
    prompt: "consent",
    state: Math.random().toString(36).substring(7),
  })
);

// Google 콜백
router.get(
  "/google/callback",
  (req, res, next) => {
    console.log("Google 콜백 수신:", {
      query: req.query,
      path: req.path,
      state: req.query.state,
      error: req.query.error,
      sessionID: req.sessionID,
    });
    if (req.query.error) {
      return res.redirect(`${FRONTEND_URL}/login?error=${req.query.error}`);
    }
    next();
  },
  passport.authenticate("google", {
    failureRedirect: `${FRONTEND_URL}/login?error=authentication_failed`,
    failWithError: true,
  }),
  (req, res) => {
    console.log("인증 성공:", req.user);
    res.redirect(`${FRONTEND_URL}/dashboard`);
  }
);

// 세션 확인
router.get("/check-session", (req, res) => {
  console.log("세션 확인:", {
    sessionID: req.sessionID,
    isAuthenticated: req.isAuthenticated(),
    user: req.user,
  });

  if (req.isAuthenticated()) {
    res.json({
      isAuthenticated: true,
      user: req.user,
    });
  } else {
    res.json({
      isAuthenticated: false,
    });
  }
});

// 로그아웃
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect(`${FRONTEND_URL}/login`);
  });
});

export default router;
