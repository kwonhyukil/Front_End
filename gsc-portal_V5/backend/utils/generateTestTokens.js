// 📄 generateTestTokens.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mysql from "mysql2/promise"; // ✅ MySQL 연결 라이브러리 사용

dotenv.config();

const { JWT_SECRET, DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

if (!JWT_SECRET) {
  console.error("❌ 환경 변수 JWT_SECRET가 설정되지 않았습니다.");
  process.exit(1);
}

// 🔹 MySQL 연결 설정
const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});

async function generateTokens() {
  try {
    console.log("🔍 `registrations` 테이블에서 사용자 정보 가져오는 중...");

    // ✅ `registrations` 테이블에서 승인 대기 중인 사용자 가져오기
    const [users] = await pool.query(
      "SELECT id, email, role_id FROM registrations"
    );

    if (users.length === 0) {
      console.log("❌ 승인 대기 중인 사용자가 없습니다.");
      return;
    }

    // 🔹 JWT 발급
    users.forEach((user) => {
      const payload = {
        id: user.id,
        email: user.email,
        role_id: user.role_id,
      };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "2h" });

      console.log(`✅ ${user.email} (role_id: ${user.role_id})`);
      console.log(`   토큰: ${token}\n`);
    });
  } catch (error) {
    console.error(
      "❌ 데이터베이스에서 사용자 정보를 가져오는 중 오류 발생:",
      error
    );
  } finally {
    await pool.end(); // ✅ MySQL 연결 종료
  }
}

// 실행
generateTokens();
