import { pool } from "../config/db.js";

/**
 * ✅ 데이터베이스 테이블 자동 생성
 */
const createTables = async () => {
  const connection = await pool.getConnection();
  try {
    console.log("📌 데이터베이스 테이블 확인 중...");

    // ✅ users 테이블 생성
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
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
      )
    `);
    console.log("✅ `users` 테이블 확인 완료.");

    // ✅ 공지사항 테이블 생성
    await connection.query(`
      CREATE TABLE IF NOT EXISTS notices (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by INT NOT NULL,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log("✅ `notices` 테이블 확인 완료.");

    // ✅ 학과 행사 일정 테이블 생성
    await connection.query(`
      CREATE TABLE IF NOT EXISTS events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        event_date DATE NOT NULL,
        created_by INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log("✅ `events` 테이블 확인 완료.");

    // ✅ 수강 과목 테이블 생성
    await connection.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        course_name VARCHAR(255) NOT NULL,
        professor VARCHAR(255) NOT NULL,
        classroom VARCHAR(255) NOT NULL
      )
    `);
    console.log("✅ `courses` 테이블 확인 완료.");

    // ✅ 학생별 시간표 테이블 생성
    await connection.query(`
      CREATE TABLE IF NOT EXISTS schedule (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        course_id INT NOT NULL,
        day ENUM('월', '화', '수', '목', '금') NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
      )
    `);
    console.log("✅ `schedule` 테이블 확인 완료.");

    console.log("🎉 모든 테이블이 정상적으로 확인 및 생성되었습니다.");
  } catch (error) {
    console.error("❌ 테이블 생성 오류:", error);
  } finally {
    connection.release();
  }
};

export default createTables;
