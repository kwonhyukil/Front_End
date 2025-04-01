import pool from "../config/db.js";

/**
 * ✅ 관리자 승인 API (registrations → users 이동)
 */
export const approveUser = async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: "사용자 ID가 필요합니다." });

  try {
    // 🔹 회원가입 대기자 정보 가져오기
    const [pendingUser] = await pool.query(
      "SELECT * FROM registrations WHERE id = ?",
      [id]
    );
    if (!pendingUser.length) {
      return res.status(404).json({ error: "해당 사용자를 찾을 수 없습니다." });
    }

    const user = pendingUser[0];

    // ✅ users 테이블로 이동
    await pool.query(
      `INSERT INTO users (name, email, studentid, phone, year, status, role, picture, created_at) 
       VALUES (?, ?, ?, ?, ?, 'approved', ?, ?, NOW())`,
      [
        user.name,
        user.email,
        user.studentid,
        user.phone,
        user.year,
        user.role,
        user.picture,
      ]
    );

    // ✅ registrations 테이블에서 삭제
    await pool.query("DELETE FROM registrations WHERE id = ?", [id]);

    res.json({ message: "사용자 승인이 완료되었습니다." });
  } catch (error) {
    res.status(500).json({ error: "승인 처리 오류" });
  }
};
