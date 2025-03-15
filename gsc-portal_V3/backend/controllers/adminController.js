import express from "express";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// ✅ 데이터베이스 연결 설정
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// ✅ 회원가입 승인 (registrations → users 이동)
export const approveUser = async (req, res) => {
  const { email } = req.body;

  try {
    const connection = await mysql.createConnection(dbConfig);

    // ✅ 신청한 사용자 정보 조회
    const [user] = await connection.query("SELECT * FROM registrations WHERE email = ?", [email]);

    if (user.length === 0) {
      await connection.end();
      return res.status(404).json({ message: "해당 사용자를 찾을 수 없습니다." });
    }

    const userData = user[0];

    // ✅ users 테이블에 데이터 이동
    await connection.query(
      `INSERT INTO users (email, studentid, phone, year, status, role, picture, name, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        userData.email,
        userData.studentid,
        userData.phone,
        userData.year,
        userData.status,
        userData.role,
        userData.picture,
        userData.name,
      ]
    );

    // ✅ registrations 테이블에서 삭제
    await connection.query("DELETE FROM registrations WHERE email = ?", [email]);

    await connection.end();
    res.json({ message: "회원가입 승인 완료!" });
  } catch (error) {
    console.error("❌ 승인 오류:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};
