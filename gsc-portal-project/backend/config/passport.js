const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const {
  googleClientID,
  googleClientSecret,
  googleRedirectURI,
} = require("./keys");

passport.use(
  new GoogleStrategy(
    {
      clientID: googleClientID,
      clientSecret: googleClientSecret,
      callbackURL: googleRedirectURI,
    },
    (accessToken, refreshToken, profile, done) => {
      console.log("✅ Google Profile:", profile);
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

module.exports = passport;
