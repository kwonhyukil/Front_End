// 📄 authMiddleware.js
import jwt from "jsonwebtoken"; // JWT(JSON Web Token) 라이브러리

const { JWT_SECRET } = process.env;

/**
 * ✅ JWT 검증 미들웨어
 * - 클라이언트 요청에 포함된 JWT 토큰을 검증하여 인증된 사용자만 접근 허용
 */
export const authRequired = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access token 없음" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Access token 만료 또는 무효" });
  }
};
