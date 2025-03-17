// [경로: backend/controllers/authController.js]
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

const { JWT_SECRET, FRONTEND_URL } = process.env;

/**
 * Google OAuth 로그인 성공 시 호출
 * - users 테이블 조회 → 없으면 registrations 테이블에 임시 저장
 * - 있으면 JWT 발급 + 프론트엔드 /login?token=... 리디렉션
 */
export const googleLoginCallback = async (req, res) => {
  try {
    const { profile } = req.user;
    const email = profile.emails[0].value;
    const name = profile.displayName;

    // users 테이블에 존재 여부 확인
    const [userRows] = await pool.query("SELECT * FROM users WHERE email=?", [
      email,
    ]);

    if (userRows.length > 0) {
      // 기존 사용자
      const user = userRows[0];
      // JWT 발급
      const payload = { id: user.id, email: user.email, role_id: user.role_id };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "2h" });
      return res.redirect(`${FRONTEND_URL}/login?token=${token}`);
    } else {
      // users에 없음 → registrations 테이블에 등록
      // 기존에 pending 상태로 있나?
      const [regRows] = await pool.query(
        "SELECT * FROM registrations WHERE email=?",
        [email]
      );
      if (regRows.length === 0) {
        // 새로 등록
        // 기본값: 학생(3) 가정
        await pool.query(
          "INSERT INTO registrations (email, name, role_id) VALUES (?,?,3)",
          [email, name]
        );
      }
      // 토큰 없이 → 프론트에서 회원정보 입력 페이지로 안내
      return res.redirect(`${FRONTEND_URL}/registration?email=${email}`);
    }
  } catch (error) {
    console.error("googleLoginCallback error:", error);
    return res.status(500).json({ error: "로그인 처리 중 오류" });
  }
};

/**
 * 로그아웃
 */
export const logout = (req, res) => {
  return res.json({ message: "로그아웃 되었습니다." });
};
