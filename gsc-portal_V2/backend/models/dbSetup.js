// backend/models/dbSetup.js
import { pool } from "../config/db.js";

async function createTables() {
  const connection = await pool.getConnection();
  try {
    console.log("🔄 DB 테이블 확인 중...");

    // ✅ users 테이블
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        studentid VARCHAR(20) UNIQUE NOT NULL,
        phone VARCHAR(20) NOT NULL,
        year ENUM('1학년','2학년','3학년') NOT NULL,
        status ENUM('재학','휴학','유학생','approved','rejected') DEFAULT '재학',
        role ENUM('학생','관리자','교수','조교') DEFAULT '학생',
        picture VARCHAR(500) DEFAULT NULL,
        name VARCHAR(255) NOT NULL,
        refresh_token TEXT,
        last_login TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // ✅ registrations (가입 대기)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS registrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        studentid VARCHAR(20) UNIQUE NOT NULL,
        phone VARCHAR(20) NOT NULL,
        year ENUM('1학년','2학년','3학년') NOT NULL,
        status ENUM('재학','휴학','유학생') DEFAULT '재학',
        role ENUM('학생','관리자','교수','조교') DEFAULT '학생',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // ✅ notices (공지사항)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS notices (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        start_date DATE DEFAULT NULL,
        end_date DATE DEFAULT NULL,
        is_important BOOLEAN DEFAULT FALSE,
        file_url VARCHAR(255) DEFAULT NULL,
        created_by INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // ✅ events (학과 행사)
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

    // ✅ courses (수강과목)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        course_name VARCHAR(255) NOT NULL,
        professor VARCHAR(255) NOT NULL,
        classroom VARCHAR(255) NOT NULL
      )
    `);

    // ✅ schedule (시간표) - `duration` 추가 및 `end_time` 자동 계산
    await connection.query(`
      CREATE TABLE IF NOT EXISTS schedule (
        id INT AUTO_INCREMENT PRIMARY KEY,
        course_name VARCHAR(255) NOT NULL,
        professor VARCHAR(255) NOT NULL,
        classroom VARCHAR(255) NOT NULL,
        day ENUM('월요일', '화요일', '수요일', '목요일', '금요일', '토요일') NOT NULL,
        start_time TIME NOT NULL,
        duration INT NOT NULL DEFAULT 50,  -- 기본 수업 길이 50분
        end_time TIME NULL,  -- NULL 허용 (트리거에서 자동 계산)
        year ENUM('1학년','2학년','3학년') NULL
      )
    `);

    // ✅ end_time 자동 계산 트리거 생성 (기존 트리거 삭제 후 새로 생성)
    await connection.query(`DROP TRIGGER IF EXISTS before_insert_schedule`);
    await connection.query(`
      CREATE TRIGGER before_insert_schedule
      BEFORE INSERT ON schedule
      FOR EACH ROW
      SET NEW.end_time = ADDTIME(NEW.start_time, SEC_TO_TIME(NEW.duration * 60));
    `);

    console.log("✅ 모든 테이블 확인/생성 완료.");
  } catch (error) {
    console.error("❌ 테이블 생성 오류:", error);
  } finally {
    connection.release();
  }
}

export default createTables;
