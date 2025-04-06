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
    if (!req.user || !req.user.profile) {
      console.error("사용자 정보가 없습니다.");
      return res.redirect(`${FRONTEND_URL}/login?error=no_user_data`);
    }

    const { profile } = req.user;
    const email = profile.emails[0].value;
    const name = profile.displayName;

    console.log("로그인 시도:", { email, name });

    // users 테이블에서 사용자 확인
    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length > 0) {
      // 기존 사용자인 경우
      const user = users[0];
      const token = jwt.sign(
        { id: user.id, email: user.email, role_id: user.role_id },
        JWT_SECRET,
        { expiresIn: "24h" }
      );
      return res.redirect(`${FRONTEND_URL}/login?token=${token}`);
    } else {
      // 신규 사용자인 경우
      const [registrations] = await pool.query(
        "SELECT * FROM registrations WHERE email = ?",
        [email]
      );

      if (registrations.length === 0) {
        // 등록 정보가 없는 경우 새로 등록
        await pool.query(
          "INSERT INTO registrations (email, name, role_id) VALUES (?, ?, 3)",
          [email, name]
        );
      }

      // 회원가입 페이지로 리다이렉트
      return res.redirect(`${FRONTEND_URL}/registration?email=${email}`);
    }
  } catch (error) {
    console.error("Google 로그인 콜백 에러:", error);
    return res.redirect(`${FRONTEND_URL}/login?error=server_error`);
  }
};

/**
 * 로그아웃
 */
export const logout = (req, res) => {
  return res.json({ message: "로그아웃 되었습니다." });
};
