import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// ✅ 데이터베이스 연결 설정
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// ✅ users 테이블 생성
const createUsersTableSQL = `
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    studentid VARCHAR(20) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    year ENUM('1학년', '2학년', '3학년') NOT NULL,
    status ENUM('재학', '휴학', '유학생') DEFAULT '재학',
    role ENUM('학생', '관리자', '교수', '조교') DEFAULT '학생',
    picture VARCHAR(500) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    name VARCHAR(255) NOT NULL,
    refresh_token VARCHAR(255) NULL,
    last_login TIMESTAMP NULL
  );
`;
// ✅ registrations 테이블 생성성
const createRegistrationsTableSQL = `
  CREATE TABLE IF NOT EXISTS registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    studentid VARCHAR(20) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    year ENUM('1학년', '2학년', '3학년') NOT NULL,
    status ENUM('재학', '휴학', '유학생') DEFAULT '재학',
    role ENUM('학생', '관리자', '교수', '조교') DEFAULT '학생',
    picture VARCHAR(500) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    name VARCHAR(255) NOT NULL
  );
`;

// ✅ 데이터베이스 및 테이블 생성 함수
const setupDatabase = async () => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log("✅ 데이터베이스 연결 성공");

    // ✅ `users` 테이블 생성
    await connection.query(createUsersTableSQL);
    console.log("✅ `users` 테이블 확인 완료");

    // ✅ `registrations` 테이블 생성
    await connection.query(createRegistrationsTableSQL);
    console.log("✅ `registrations` 테이블 확인 완료");

    await connection.end();
  } catch (error) {
    console.error("❌ 데이터베이스 설정 중 오류 발생:", error);
  }
};

export default setupDatabase;
