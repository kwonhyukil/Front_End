// 📄 googleAuth.js
// Google OAuth 설정
import "./dotenv.js";
import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

dotenv.config();

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

export const googleConfig = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${BACKEND_URL}/auth/google/callback`,
  passReqToCallback: true,
};

export const googleStrategy = new GoogleStrategy(googleConfig, async function (
  request,
  accessToken,
  refreshToken,
  profile,
  done
) {
  try {
    console.log("Google 인증 시도:", {
      id: profile.id,
      email: profile.emails?.[0]?.value,
      name: profile.displayName,
      callbackURL: googleConfig.callbackURL,
    });

    return done(null, {
      id: profile.id,
      email: profile.emails?.[0]?.value,
      name: profile.displayName,
      accessToken,
    });
  } catch (error) {
    console.error("Google 전략 에러:", error);
    return done(error, null);
  }
});
