// 📄 googleAuth.js
// Google OAuth 설정
import "./dotenv.js";

export const googleConfig = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_LOGIN_REDIRECT_URI,
};
