import { pool } from "../config/db.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwtUtils.js";

/**
 * ✅ 회원가입 승인 → users 테이블로 이동
 */
export const approveUserRegistration = async (email) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 🔹 `registrations` 테이블에서 사용자 정보 가져오기
    const [rows] = await connection.query(
      "SELECT * FROM registrations WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      throw new Error("가입 신청 정보가 없습니다.");
    }

    const user = rows[0];

    // 🔹 `users` 테이블에 삽입
    await connection.query(
      `INSERT INTO users (name, email, studentid, phone, year, status, role, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        user.name,
        user.email,
        user.studentid,
        user.phone,
        user.year,
        user.status,
        user.role,
      ]
    );

    // 🔹 `registrations` 테이블에서 해당 데이터 삭제
    await connection.query("DELETE FROM registrations WHERE email = ?", [
      email,
    ]);

    await connection.commit();
    console.log(`✅ ${email} 회원가입 승인 완료 (users 테이블로 이동)`);

    const { accessToken, refreshToken } = generateTokens(user);
    return { success: true, accessToken, refreshToken };
  } catch (error) {
    await connection.rollback();
    console.error("❌ 회원가입 승인 오류:", error.message);
    throw error;
  } finally {
    connection.release();
  }
};

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
// ✅ Refresh Token 저장
export const updateUserRefreshToken = async (email, refreshToken) => {
  await pool.query("UPDATE users SET refresh_token = ? WHERE email = ?", [
    refreshToken,
    email,
  ]);
};

// ✅ 사용자 인증 & 토큰 발급
export const authenticateUser = async (email) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  if (rows.length === 0) return null;

  const user = rows[0];
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // 🔹 DB에 Refresh Token 저장
  await updateUserRefreshToken(email, refreshToken);

  return { accessToken, refreshToken };
};

// ✅ Refresh Token으로 Access Token 갱신
export const refreshUserToken = async (refreshToken) => {
  const decoded = verifyRefreshToken(refreshToken);
  if (!decoded) return null;

  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
    decoded.email,
  ]);
  if (rows.length === 0) return null;

  const user = rows[0];
  const newAccessToken = generateAccessToken(user);
  return { accessToken: newAccessToken };
};
