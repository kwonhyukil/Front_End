import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_LOGIN_REDIRECT_URI,
      passReqToCallback: true,
    },
    (request, accessToken, refreshToken, profile, done) => {
      console.log("✅ Google OAuth 인증 완료, 사용자 프로필:", profile);
      return done(null, profile._json);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
export default passport;
