import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

dotenv.config();

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

// ✅ Google OAuth 설정 객체
export const googleConfig = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${BACKEND_URL}/api/auth/google/callback`, // Google 승인 후 호출될 경로
  passReqToCallback: true, // request 객체도 콜백 함수에서 받을 수 있게 함
};

// ✅ Google OAuth 전략 정의
export const googleStrategy = new GoogleStrategy(
  googleConfig,
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      // 이메일, 이름 추출 (일부 계정은 이메일 정보 제공 안할 수도 있음)
      const email = profile.emails?.[0]?.value || null;
      const name = profile.displayName || "이름없음";

      if (!email) {
        console.log("❌ 이메일 정보 없음:", profile);
        return done(null, false, { message: "no_email" });
      }

      const userProfile = {
        email,
        name,
      };

      return done(null, userProfile); // 인증된 유저 정보 반환
    } catch (err) {
      return done(err, null);
    }
  }
);
