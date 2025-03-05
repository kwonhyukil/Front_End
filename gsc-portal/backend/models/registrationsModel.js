// ✅ backend/models/registrationsModel.js
import { pool } from "../config/db.js";

/**
 * ✅ `registrations` 테이블 생성
 */
export async function createRegistrationsTable() {
  try {
    const connection = await pool.getConnection();

    // ✅ `registrations` 테이블 생성
    await connection.query(`
      CREATE TABLE IF NOT EXISTS registrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        studentid VARCHAR(20) UNIQUE NOT NULL,
        phone VARCHAR(20) NOT NULL,
        year ENUM('1학년', '2학년', '3학년') NOT NULL,
        status ENUM('재학', '휴학', '유학생') DEFAULT '재학',
        role ENUM('학생', '관리자', '교수', '조교') DEFAULT '학생',
        picture VARCHAR(500) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        name VARCHAR(255) NOT NULL
      );
    `);

    connection.release();
    console.log("✅ `registrations` 테이블이 준비되었습니다.");
  } catch (error) {
    console.error("❌ `registrations` 테이블 생성 오류:", error);
  }
}
