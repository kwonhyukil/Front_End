// backend/utils/jwtUtils.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const generateTokens = (user) => {
  const payload = { email: user.email, role: user.role };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};
