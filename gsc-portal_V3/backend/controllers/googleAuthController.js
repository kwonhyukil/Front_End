import passport from "passport";
import mysql from "mysql2/promise";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// ✅ JWT 토큰 생성 함수
const generateAccessToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.ACCESS_SECRET,
    { expiresIn: "1h" }
  );

const generateRefreshToken = (user) =>
  jwt.sign({ id: user.id }, process.env.REFRESH_SECRET, { expiresIn: "7d" });

// ✅ 1️⃣ Google OAuth 로그인 요청
export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

// ✅ 2️⃣ Google OAuth 로그인 콜백 처리
export const googleAuthCallback = async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=OAuth 실패`);
    }

    const { email, name, picture } = req.user;
    const connection = await mysql.createConnection(dbConfig);

    // ✅ 3️⃣ 이미 승인된 사용자 확인
    const [existingUser] = await connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      const accessToken = generateAccessToken(existingUser[0]);
      const refreshToken = generateRefreshToken(existingUser[0]);

      await connection.query(
        "UPDATE users SET refresh_token = ? WHERE email = ?",
        [refreshToken, email]
      );
      await connection.end();

      // ✅ 🔥 기존 `/api/auth/callback` → `/auth/callback` (프론트엔드 실제 페이지로 이동)
      return res.redirect(
        `${
          process.env.FRONTEND_URL
        }/api/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}&user=${JSON.stringify(
          existingUser[0]
        )}`
      );
    }

    // ✅ 4️⃣ 이미 회원가입 신청한 사용자 확인 (승인 대기 상태)
    const [pendingUser] = await connection.query(
      "SELECT * FROM registrations WHERE email = ?",
      [email]
    );

    if (pendingUser.length > 0) {
      await connection.end();
      // ✅ 🔥 기존 `/api/auth/approval` → `/auth/approval`
      return res.redirect(`${process.env.FRONTEND_URL}/auth/approval`);
    }

    // ✅ 5️⃣ `registrations` 테이블에 저장 (관리자 승인 대기)
    await connection.query(
      `INSERT INTO registrations (email, name, picture, role) VALUES (?, ?, ?, ?);`,
      [email, name, picture, "학생"]
    );

    await connection.end();
    // ✅ 🔥 기존 `/api/auth/approval` → `/auth/approval`
    return res.redirect(`${process.env.FRONTEND_URL}/auth/approval`);
  } catch (error) {
    console.error("❌ Google OAuth 로그인 오류:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};
