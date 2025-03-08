import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// ✅ 데이터베이스 연결 풀 생성
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ✅ 데이터베이스 초기화 함수 추가
export const initializeDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ 데이터베이스 연결 성공");
    connection.release();
  } catch (error) {
    console.error("❌ 데이터베이스 연결 실패:", error.message);
    process.exit(1); // 에러 발생 시 서버 종료
  }
};

export { pool }; // ✅ 데이터베이스 풀도 함께 export
