// 데이터베이스 연결 설정정
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ✅ DB 연결 테스트용 함수
export const initializeDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ 데이터베이스 연결 성공");
    connection.release();
  } catch (error) {
    console.error("❌ 데이터베이스 연결 실패:", error.message);
  }
};

export default pool;
