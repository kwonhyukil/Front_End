const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  googleClientID: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleRedirectURI: process.env.GOOGLE_REDIRECT_URI,
  jwtSecret: process.env.JWT_SECRET,
  frontendURL: process.env.FRONTEND_URL,
};
