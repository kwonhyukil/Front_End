import jwt from "jsonwebtoken";

/**
 * ✅ JWT 및 Refresh Token 생성 함수
 */
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
