import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import keys from "../config/keys.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: keys.googleRedirectURI,
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

// ✅ 직렬화 (세션에 저장)
passport.serializeUser((user, done) => {
  done(null, user);
});

// ✅ 역직렬화 (세션에서 사용자 정보 복원)
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

export default passport;
