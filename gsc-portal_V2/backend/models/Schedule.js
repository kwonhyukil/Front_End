import { pool } from "../config/db.js";

/**
 * ✅ `schedule` 테이블 생성
 */
export async function createScheduleTable() {
  try {
    const connection = await pool.getConnection();

    await connection.query(`
      CREATE TABLE IF NOT EXISTS schedule (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        professor VARCHAR(255) NOT NULL,
        classroom VARCHAR(255) NOT NULL,
        day ENUM('월', '화', '수', '목', '금') NOT NULL,
        time VARCHAR(20) NOT NULL,
        year ENUM('1학년', '2학년', '3학년') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    connection.release();
    console.log("✅ `schedule` 테이블이 준비되었습니다.");
  } catch (error) {
    console.error("❌ `schedule` 테이블 생성 오류:", error);
  }
}
