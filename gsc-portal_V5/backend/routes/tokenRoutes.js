// [경로: backend/routes/tokenRoutes.js]
import { Router } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { findRefreshToken } from "../models/users.js";
// findRefreshToken: DB에서 refresh_token=? 검색 후 결과 반환

dotenv.config();
const router = Router();

router.post("/refresh", async (req, res) => {
  const token = req.cookies.refreshToken; // 쿠키에 저장
  if (!token) {
    return res.status(401).json({ error: "Refresh token 없음" });
  }
  try {
    // DB에서 refreshToken 존재 여부 확인
    const valid = await findRefreshToken(token);
    if (!valid) {
      return res.status(403).json({ error: "Refresh token 무효함" });
    }
    // 유효하면 accessToken 재발급
    const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const newAccessToken = jwt.sign(
      { id: payload.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(401).json({ error: "토큰 검증 실패" });
  }
});

export default router;
