import pool from "../config/db.js"; // MySQL 연결 풀을 가져옴

/**
 * ✅ 사용자 프로필 조회
 * - 로그인한 사용자의 ID를 기반으로 DB에서 정보를 가져옴
 */
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // 요청한 사용자의 ID (JWT에서 해석된 정보)

    // ✅ 데이터베이스에서 사용자 정보 조회
    const [rows] = await pool.query(
      "SELECT id, name, email, phone, role_id FROM users WHERE id=?",
      [userId]
    );

    // 사용자가 존재하지 않는 경우 404 응답
    if (rows.length === 0) {
      return res.status(404).json({ error: "사용자를 찾을 수 없음" });
    }

    // ✅ 사용자 정보를 JSON 형식으로 반환
    return res.json(rows[0]);
  } catch (error) {
    console.error("getUserProfile error:", error);
    return res.status(500).json({ error: "사용자 정보 조회 오류" });
  }
};
