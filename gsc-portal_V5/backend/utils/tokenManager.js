import jwt from "jsonwebtoken";
import { saveRefreshToken } from "../models/users.js";

// ✅ Access Token 발급 함수
export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role_id: user.role_id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

// ✅ Refresh Token 발급 함수
export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
};

// ✅ Refresh Token 저장 함수 (DB 반영)
export const storeRefreshToken = async (userId, token) => {
  await saveRefreshToken(userId, token);
};

// ✅ Refresh Token 검증 함수
export const verifyRefreshToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) return reject(err);
      resolve(decoded);
    });
  });
};
