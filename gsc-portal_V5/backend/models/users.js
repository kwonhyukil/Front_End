import pool from "../config/db.js";

// 사용자 이메일로 조회
export const findUserByEmail = async (email) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  return rows[0];
};

// Refresh Token 저장
export const saveRefreshToken = async (userId, token) => {
  await pool.query("UPDATE users SET refresh_token = ? WHERE id = ?", [
    token,
    userId,
  ]);
};

// 신규 사용자 생성
export const createUser = async ({ name, email }) => {
  const [result] = await pool.query(
    "INSERT INTO users (name, email, role_id) VALUES (?, ?, 3)",
    [name, email]
  );
  return result.insertId;
};
// ✅ Refresh Token 존재 여부 확인
export const findRefreshToken = async (token) => {
  const [rows] = await pool.query(
    "SELECT * FROM users WHERE refresh_token = ?",
    [token]
  );
  return rows.length > 0;
};
