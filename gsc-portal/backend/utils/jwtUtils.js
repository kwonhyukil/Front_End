import jwt from "jsonwebtoken";

// ✅ JWT 비밀키 설정
const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || "access-secret";
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || "refresh-secret";

// ✅ Access Token 생성 (만료: 1시간)
export const generateAccessToken = (user) => {
  return jwt.sign({ email: user.email, role: user.role }, ACCESS_SECRET, {
    expiresIn: "1h",
  });
};

// ✅ Refresh Token 생성 (만료: 7일)
export const generateRefreshToken = (user) => {
  return jwt.sign({ email: user.email }, REFRESH_SECRET, { expiresIn: "7d" });
};

// ✅ Refresh Token 검증
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, REFRESH_SECRET);
  } catch (error) {
    return null;
  }
};
