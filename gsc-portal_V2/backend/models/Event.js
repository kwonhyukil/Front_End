import { pool } from "../config/db.js";

/**
 * ✅ `events` 테이블 생성
 */
export async function createEventsTable() {
  try {
    const connection = await pool.getConnection();

    await connection.query(`
      CREATE TABLE IF NOT EXISTS events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        event_date DATE NOT NULL,
        created_by VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    connection.release();
    console.log("✅ `events` 테이블이 준비되었습니다.");
  } catch (error) {
    console.error("❌ `events` 테이블 생성 오류:", error);
  }
}
