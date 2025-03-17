import { Router } from "express";
import pool from "../config/db.js";
import { authRequired } from "../middleware/authMiddleware.js";

const router = Router();

/**
 * ✅ 가입 대기 목록 조회 (관리자만)
 */
router.get("/registrations", authRequired, async (req, res) => {
  try {
    if (req.user.role_id !== 1) {
      return res.status(403).json({ error: "관리자 권한이 필요합니다." });
    }
    const [rows] = await pool.query(
      "SELECT * FROM registrations ORDER BY requested_at DESC"
    );
    return res.json(rows);
  } catch (error) {
    console.error("🚨 가입 대기 목록 조회 오류:", error);
    return res.status(500).json({ error: "가입 대기 목록 조회 오류" });
  }
});

/**
 * ✅ 사용자 승인
 */
router.post("/approve/:id", authRequired, async (req, res) => {
  try {
    if (req.user.role_id !== 1)
      return res.status(403).json({ error: "관리자 권한이 필요합니다." });

    const userId = req.params.id;
    await pool.query(
      "INSERT INTO users (name, email, phone, role_id) SELECT name, email, phone, role_id FROM registrations WHERE id=?",
      [userId]
    );
    await pool.query("DELETE FROM registrations WHERE id=?", [userId]);

    return res.json({ message: "사용자가 승인되었습니다." });
  } catch (error) {
    console.error("🚨 사용자 승인 오류:", error);
    return res.status(500).json({ error: "사용자 승인 오류" });
  }
});

/**
 * ✅ 사용자 거절
 */
router.delete("/reject/:id", authRequired, async (req, res) => {
  try {
    if (req.user.role_id !== 1)
      return res.status(403).json({ error: "관리자 권한이 필요합니다." });

    const userId = req.params.id;
    await pool.query("DELETE FROM registrations WHERE id=?", [userId]);

    return res.json({ message: "가입 요청이 거절되었습니다." });
  } catch (error) {
    console.error("🚨 사용자 거절 오류:", error);
    return res.status(500).json({ error: "사용자 거절 오류" });
  }
});

export default router;
