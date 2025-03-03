import { pool } from "../config/db.js";

// ✅ 기존 가입 여부 확인 (users 테이블 조회)
export const getUserByEmail = async (email) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  return rows.length > 0 ? rows[0] : null;
};

// ✅ 기존 회원가입 신청 여부 확인 (registrations 테이블 조회)
export const getPendingUserByEmail = async (email) => {
  const [rows] = await pool.query(
    "SELECT * FROM registrations WHERE email = ?",
    [email]
  );
  return rows.length > 0 ? rows[0] : null;
};

// ✅ 회원가입 요청을 `registrations` 테이블에 저장
export const registerPendingUserService = async (userData) => {
  const { name, email, studentid, phone, year, status, role } = userData;

  const [result] = await pool.query(
    `INSERT INTO registrations (name, email, studentid, phone, year, status, role, created_at) 
     VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
    [name, email, studentid, phone, year, status, role]
  );

  console.log("✅ 회원가입 요청 저장 완료:", result.insertId);
  return result.insertId;
};

/**
 * ✅ 마지막 로그인 시간 업데이트
 */
export const updateLastLogin = async (email) => {
  await pool.query("UPDATE users SET last_login = NOW() WHERE email = ?", [
    email,
  ]);
};

/**
 * ✅ 관리자 승인
 */
export const approveUserService = async (id) => {
  const [result] = await pool.query(
    "UPDATE users SET status = 'approved' WHERE id = ?",
    [id]
  );
  if (result.affectedRows === 0)
    return { error: "해당 사용자를 찾을 수 없습니다." };
  return { message: "사용자 승인이 완료되었습니다." };
};

/**
 * ✅ 관리자 거절
 */
export const rejectUserService = async (id) => {
  const [result] = await pool.query(
    "UPDATE users SET status = 'rejected' WHERE id = ?",
    [id]
  );
  if (result.affectedRows === 0)
    return { error: "해당 사용자를 찾을 수 없습니다." };
  return { message: "사용자 가입이 거부되었습니다." };
};
