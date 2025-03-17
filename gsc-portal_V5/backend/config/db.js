// 📄 db.js
// MySQL 데이터베이스 연결 설정
import mysql from "mysql2/promise";
import "./dotenv.js"; // 환경변수 로드

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

// MySQL 커넥션 풀 생성
const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  // 비밀번호에서 큰따옴표 제거 (예시)
  password: DB_PASSWORD.replace(/"/g, ""),
  database: DB_NAME,
  connectionLimit: 10,
});

export default pool;
