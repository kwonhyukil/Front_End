import jwt from "jsonwebtoken";
import { getUserByEmail } from "../services/authService.js";

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "인증 토큰이 필요합니다." });
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await getUserByEmail(decoded.email); // ✅ DB에서 사용자 정보 가져오기

    if (!user) {
      return res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
    }

    req.user = user; // ✅ 사용자 정보 저장 (id 포함)
    next();
  } catch (error) {
    return res.status(403).json({ error: "유효하지 않은 토큰입니다." });
  }
};

// ✅ 역할 체크
export const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "권한이 없습니다." });
    }
    next();
  };
};
