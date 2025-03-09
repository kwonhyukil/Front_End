import { pool } from "../config/db.js";

/**
 * ✅ `notices` 테이블 생성
 */
export async function createNoticesTable() {
  try {
    const connection = await pool.getConnection();

    await connection.query(`
      CREATE TABLE IF NOT EXISTS notices (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        author VARCHAR(255) NOT NULL,
        role ENUM('학생', '관리자', '교수', '조교') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    connection.release();
    console.log("✅ `notices` 테이블이 준비되었습니다.");
  } catch (error) {
    console.error("❌ `notices` 테이블 생성 오류:", error);
  }
}
