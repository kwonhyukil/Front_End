const mysql = require("mysql2/promise");
require("dotenv").config();

// MySQL 연결 풀 생성
const pool = mysql.createPool({
  host: process.env.DB_HOST,       // 로컬 MySQL 서버 주소
  user: process.env.DB_USER,       // MySQL 사용자 계정
  password: process.env.DB_PASSWORD, // 비밀번호
  database: process.env.DB_NAME,   // 데이터베이스 이름
  port: process.env.DB_PORT,       // MySQL 기본 포트 3306
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
