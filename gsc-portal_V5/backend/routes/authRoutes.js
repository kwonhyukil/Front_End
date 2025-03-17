// [경로: backend/routes/authRoutes.js]
import { Router } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { googleConfig } from "../config/googleAuth.js";
import { googleLoginCallback, logout } from "../controllers/authController.js";

const router = Router();

passport.use(
  new GoogleStrategy(
    googleConfig,
    (accessToken, refreshToken, profile, done) => {
      return done(null, { profile });
    }
  )
);
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// /auth/google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// /auth/google/callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  googleLoginCallback
);

// /auth/logout
router.get("/logout", logout);

export default router;
