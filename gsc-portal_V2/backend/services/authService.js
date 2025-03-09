// backend/services/authService.js
import { pool } from "../config/db.js";
import { generateTokens } from "../utils/jwtUtils.js";

export const getUserByEmail = async (email) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  return rows.length ? rows[0] : null;
};

export const getPendingUserByEmail = async (email) => {
  const [rows] = await pool.query(
    "SELECT * FROM registrations WHERE email = ?",
    [email]
  );
  return rows.length ? rows[0] : null;
};

// 가입 대기 테이블에 등록
export const registerPendingUserService = async (userData) => {
  const { name, email, studentid, phone, year, status, role } = userData;
  await pool.query(
    `INSERT INTO registrations (name, email, studentid, phone, year, status, role, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
    [name, email, studentid, phone, year, status, role]
  );
};

// 특정 이메일 승인을 users 테이블에 이동
export const approveUserRegistration = async (email) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [rows] = await connection.query(
      "SELECT * FROM registrations WHERE email = ?",
      [email]
    );
    if (!rows.length) throw new Error("가입 신청 정보가 없습니다.");

    const user = rows[0];
    await connection.query(
      `INSERT INTO users (email, studentid, phone, year, status, role, name, created_at)
       VALUES (?, ?, ?, ?, 'approved', ?, ?, NOW())`,
      [user.email, user.studentid, user.phone, user.year, user.role, user.name]
    );
    await connection.query("DELETE FROM registrations WHERE email = ?", [
      email,
    ]);

    await connection.commit();

    // JWT 발급
    const { accessToken, refreshToken } = generateTokens(user);
    await updateUserRefreshToken(user.email, refreshToken);

    return { success: true, token: accessToken, refreshToken };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const updateUserRefreshToken = async (email, refreshToken) => {
  await pool.query("UPDATE users SET refresh_token = ? WHERE email = ?", [
    refreshToken,
    email,
  ]);
};

export const updateLastLogin = async (email) => {
  await pool.query("UPDATE users SET last_login = NOW() WHERE email = ?", [
    email,
  ]);
};
