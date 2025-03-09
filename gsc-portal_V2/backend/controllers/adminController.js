// backend/controllers/adminController.js
import { pool } from "../config/db.js";

// 관리자가 등록 대기중인 사용자 목록 확인
export const getPendingUsers = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM registrations");
    res.json(rows);
  } catch (error) {
    console.error("❌ 대기 사용자 조회 오류:", error);
    res.status(500).json({ error: "대기 사용자 조회 중 오류 발생" });
  }
};

// 관리자가 승인 => registrations -> users 이동
export const approveUser = async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: "사용자 ID 필요" });

  try {
    const [pending] = await pool.query("SELECT * FROM registrations WHERE id = ?", [id]);
    if (!pending.length) return res.status(404).json({ error: "해당 사용자 없음" });
    const user = pending[0];

    // users로 이동
    await pool.query(
      `INSERT INTO users (email, studentid, phone, year, status, role, name, created_at)
       VALUES (?, ?, ?, ?, 'approved', ?, ?, NOW())`,
      [user.email, user.studentid, user.phone, user.year, user.role, user.name]
    );

    // 대기 테이블 삭제
    await pool.query("DELETE FROM registrations WHERE id = ?", [id]);
    res.json({ message: "승인 완료" });
  } catch (error) {
    console.error("❌ 승인 오류:", error);
    res.status(500).json({ error: "승인 처리 중 오류" });
  }
};

// 거절 => registrations에서 삭제
export const rejectUser = async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: "사용자 ID 필요" });

  try {
    const [result] = await pool.query("DELETE FROM registrations WHERE id = ?", [id]);
    if (!result.affectedRows) return res.status(404).json({ error: "해당 사용자 없음" });
    res.json({ message: "거절 완료" });
  } catch (error) {
    console.error("❌ 거절 오류:", error);
    res.status(500).json({ error: "거절 처리 중 오류" });
  }
};
