// ✅ Refresh Token을 사용하여 새로운 Access Token 발급
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

// ✅ 새 Access Token 발급 함수
const generateAccessToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.ACCESS_SECRET,
    { expiresIn: "1h" }
  );

// ✅ Refresh Token 검증 후 Access Token 갱신
export const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(403).json({ message: "Refresh Token이 없습니다." });
  }

  try {
    const connection = await mysql.createConnection(dbConfig);

    // ✅ `users` 테이블에서 Refresh Token 확인
    const [user] = await connection.query(
      "SELECT * FROM users WHERE refresh_token = ?",
      [refreshToken]
    );

    if (user.length === 0) {
      await connection.end();
      return res
        .status(403)
        .json({ message: "유효하지 않은 Refresh Token입니다." });
    }

    // ✅ 새 Access Token 발급
    const newAccessToken = generateAccessToken(user[0]);
    await connection.end();

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("❌ Refresh Token 검증 오류:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};
