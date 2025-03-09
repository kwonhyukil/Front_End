// backend/config/keys.js
import dotenv from "dotenv";
dotenv.config();

const keys = {
  googleClientID: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleRedirectURI: process.env.GOOGLE_LOGIN_REDIRECT_URI,
  googleCalendarRedirectURI: process.env.GOOGLE_CALENDAR_REDIRECT_URI,
  jwtSecret: process.env.JWT_SECRET,
  refreshSecret: process.env.REFRESH_SECRET,
  frontendURL: process.env.FRONTEND_URL,
  backendURL: process.env.BACKEND_URL,
};

export default keys;
