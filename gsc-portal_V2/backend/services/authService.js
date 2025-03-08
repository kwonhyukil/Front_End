import { pool } from "../config/db.js"; // ✅ DB 연결 정보 가져오기
import { generateTokens } from "../utils/jwtUtils.js"; // ✅ JWT 토큰 생성 함수 가져오기

/**
 * ✅ 특정 이메일로 사용자 조회 (users 테이블)
 * @param {string} email - 조회할 사용자 이메일
 * @returns {object | null} - 사용자 정보 또는 null
 */
export const getUserByEmail = async (email) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  return rows.length > 0 ? rows[0] : null;
};

/**
 * ✅ 특정 이메일로 가입 신청 정보 조회 (registrations 테이블)
 * @param {string} email - 조회할 이메일
 * @returns {object | null} - 가입 신청 정보 또는 null
 */
export const getPendingUserByEmail = async (email) => {
  const [rows] = await pool.query(
    "SELECT * FROM registrations WHERE email = ?",
    [email]
  );
  return rows.length > 0 ? rows[0] : null;
};

/**
 * ✅ 회원가입 요청을 `registrations` 테이블에 저장
 * @param {object} userData - 회원가입 신청 정보
 */
export const registerPendingUserService = async (userData) => {
  const { name, email, studentid, phone, year, status, role } = userData;

  await pool.query(
    `INSERT INTO registrations (name, email, studentid, phone, year, status, role, created_at) 
     VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
    [name, email, studentid, phone, year, status, role]
  );

  console.log("✅ 회원가입 요청 저장 완료:", email);
};

/**
 * ✅ 관리자 승인 후 `users` 테이블로 이동
 * @param {string} email - 승인할 사용자 이메일
 * @returns {object} - JWT 토큰 및 성공 여부
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

    // 🔹 `registrations` 테이블에서 삭제
    await connection.query("DELETE FROM registrations WHERE email = ?", [
      email,
    ]);

    await connection.commit();
    console.log(`✅ ${email} 회원가입 승인 완료 (users 테이블로 이동)`);

    // ✅ JWT 토큰 생성
    const { accessToken, refreshToken } = generateTokens(user);
    await updateUserRefreshToken(user.email, refreshToken);

    return { success: true, token: accessToken, refreshToken };
  } catch (error) {
    await connection.rollback();
    console.error("❌ 회원가입 승인 오류:", error.message);
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * ✅ JWT Refresh Token 저장 (users 테이블)
 * @param {string} email - 사용자 이메일
 * @param {string} refreshToken - 저장할 Refresh Token
 */
export const updateUserRefreshToken = async (email, refreshToken) => {
  await pool.query("UPDATE users SET refresh_token = ? WHERE email = ?", [
    refreshToken,
    email,
  ]);
  console.log(`🔄 Refresh Token 저장 완료: ${email}`);
};

/**
 * ✅ 마지막 로그인 시간 업데이트
 * @param {string} email - 사용자 이메일
 */
export const updateLastLogin = async (email) => {
  await pool.query("UPDATE users SET last_login = NOW() WHERE email = ?", [
    email,
  ]);
};

/**
 * ✅ 관리자 승인 (status를 'approved'로 변경)
 * @param {number} id - 승인할 사용자 ID
 * @returns {object} - 승인 메시지 또는 오류 메시지
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
 * ✅ 관리자 거절 (status를 'rejected'로 변경)
 * @param {number} id - 거절할 사용자 ID
 * @returns {object} - 거절 메시지 또는 오류 메시지
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
