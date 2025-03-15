import jwt from "jsonwebtoken"; // JWT(JSON Web Token) 라이브러리
import pool from "../config/db.js"; // MySQL 데이터베이스 연결 풀

// 환경 변수에서 JWT_SECRET 및 FRONTEND_URL 가져오기
const { JWT_SECRET, FRONTEND_URL } = process.env;

/**
 * ✅ Google OAuth 로그인 성공 시 호출되는 콜백 함수
 * - Google에서 인증된 사용자의 정보를 받아 JWT 발급
 * - 데이터베이스에서 기존 사용자 확인 후 역할(role_id) 부여
 * - 토큰을 포함하여 프론트엔드로 리디렉션
 */
export const googleLoginCallback = async (req, res) => {
  try {
    // ✅ Passport에서 제공하는 사용자 프로필 정보 가져오기
    const { profile } = req.user;
    const email = profile.emails[0].value; // 사용자 이메일
    const name = profile.displayName; // 사용자 이름

    // ✅ 사용자 역할(role_id) 결정
    let roleId = 3; // 기본값: 학생 (role_id = 3)
    if (email === "admin@g.yju.ac.kr") {
      roleId = 1; // 관리자 (role_id = 1)
    } else if (email.endsWith("@g.yju.ac.kr")) {
      roleId = 2; // 교수 (role_id = 2)
    }

    // ✅ DB에서 해당 이메일을 가진 사용자가 존재하는지 확인
    const [rows] = await pool.query(
      "SELECT id, role_id FROM users WHERE email=?",
      [email]
    );

    let userId;
    if (rows.length > 0) {
      // ✅ 기존 사용자라면 정보 업데이트 (이름 및 역할)
      userId = rows[0].id;
      await pool.query("UPDATE users SET name=?, role_id=? WHERE id=?", [
        name,
        roleId,
        userId,
      ]);
    } else {
      // ✅ 새로운 사용자라면 DB에 추가
      const [result] = await pool.query(
        "INSERT INTO users (name, email, role_id) VALUES (?, ?, ?)",
        [name, email, roleId]
      );
      userId = result.insertId; // 새로 생성된 사용자 ID 저장
    }

    // ✅ JWT(JSON Web Token) 발급
    const payload = { id: userId, email, role_id: roleId }; // 토큰에 포함할 정보
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "2h" }); // 토큰 유효기간: 2시간

    // ✅ 프론트엔드 로그인 페이지(`/login`)로 리디렉션하면서 JWT 전달
    return res.redirect(`${FRONTEND_URL}/login?token=${token}`);
  } catch (error) {
    console.error("googleLoginCallback error:", error);
    return res.status(500).json({ error: "로그인 처리 중 오류" });
  }
};

/**
 * ✅ 로그아웃 처리 (JWT 기반)
 * - JWT는 클라이언트에서 저장되므로, 백엔드에서 직접 삭제할 필요 없음
 * - 프론트엔드에서 로컬 스토리지(LocalStorage) 또는 세션에서 토큰 삭제 필요
 */
export const logout = (req, res) => {
  return res.json({ message: "로그아웃 되었습니다." });
};
