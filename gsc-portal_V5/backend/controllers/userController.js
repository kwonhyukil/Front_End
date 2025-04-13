// [경로: backend/controllers/userController.js]
import pool from "../config/db.js";

/**
 * ✅ role_id = 2 (교수) 만 조회
 */
export const getProfessors = async (req, res) => {
  try {
    console.log("📥 교수 목록 요청 들어옴");
    const [rows] = await pool.query(
      `SELECT id, name FROM users WHERE role_id = 2`
    );
    console.log("🎓 교수 목록 결과:", rows);
    res.json(rows);
  } catch (err) {
    console.error("❌ 교수 목록 조회 오류:", err);
    res.status(500).json({ error: "교수 목록 조회 실패" });
  }
};

export const saveRegistration = async (req, res) => {
  try {
    const { email, name, phone, student_id, role_id, is_international } =
      req.body;

    // registrations에 이미 존재 여부
    const [rows] = await pool.query(
      "SELECT * FROM registrations WHERE email=?",
      [email]
    );
    if (rows.length > 0) {
      await pool.query(
        `UPDATE registrations
         SET name=?, phone=?, student_id=?, role_id=?, is_international=?
         WHERE email=?`,
        [name, phone, student_id, role_id, is_international, email]
      );
    } else {
      await pool.query(
        `INSERT INTO registrations (email, name, phone, student_id, role_id, is_international)
         VALUES (?,?,?,?,?,?)`,
        [email, name, phone, student_id, role_id, is_international]
      );
    }
    return res.json({
      message: "임시 회원정보가 저장되었습니다. 관리자 승인 대기중.",
    });
  } catch (error) {
    return res.status(500).json({ error: "회원가입 정보 저장 오류" });
  }
};

/**
 * 관리자 승인 (registrations → users)
 */
export const approveRegistration = async (req, res) => {
  try {
    const registrationId = req.params.id;
    const [regRows] = await pool.query(
      "SELECT * FROM registrations WHERE id=?",
      [registrationId]
    );
    if (regRows.length === 0) {
      return res.status(404).json({ error: "등록정보 없음" });
    }
    const reg = regRows[0];
    const [result] = await pool.query(
      `INSERT INTO users (name, email, phone, role_id, student_id, is_international)
       VALUES (?,?,?,?,?,?)`,
      [
        reg.name,
        reg.email,
        reg.phone,
        reg.role_id,
        reg.student_id,
        reg.is_international,
      ]
    );
    await pool.query("UPDATE registrations SET status='approved' WHERE id=?", [
      registrationId,
    ]);

    return res.json({ message: "회원 승인 완료", user_id: result.insertId });
  } catch (error) {
    return res.status(500).json({ error: "회원 승인 오류" });
  }
};

/**
 * 관리자 거부
 */
export const rejectRegistration = async (req, res) => {
  try {
    const registrationId = req.params.id;
    await pool.query("UPDATE registrations SET status='rejected' WHERE id=?", [
      registrationId,
    ]);
    return res.json({ message: "회원 거부 처리 완료" });
  } catch (error) {
    return res.status(500).json({ error: "회원 거부 오류" });
  }
};

/**
 * 사용자 프로필 조회 (승인된 사용자)
 */
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query(
      `SELECT u.*, r.role_name FROM users u
       JOIN roles r ON u.role_id=r.id
       WHERE u.id=?`,
      [userId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "사용자 없음" });
    }
    return res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ error: "프로필 조회 오류" });
  }
};

/**
 * 대기 목록 조회 (관리자 전용)
 */
export const getRegistrations = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM registrations ORDER BY created_at DESC"
    );
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ error: "등록정보 조회 오류" });
  }
};
