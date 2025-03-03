// 📌 backend/config/db.js

import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { createUsersTable } from "../models/User.js";
import { createRegistrationsTable } from "../models/registrationsModel.js";

dotenv.config();

// ✅ MySQL 연결 풀 생성
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ✅ 데이터베이스 초기화 함수 (테이블 생성 포함)
async function initializeDatabase() {
  try {
    console.log("🔄 데이터베이스 초기화 중...");
    await createUsersTable();
    await createRegistrationsTable();
    console.log("✅ 모든 테이블이 정상적으로 초기화되었습니다.");
  } catch (error) {
    console.error("❌ 데이터베이스 초기화 오류:", error);
  }
}

// ✅ `pool`을 export하여 다른 파일에서 사용 가능
export default pool;
export { pool, initializeDatabase };
