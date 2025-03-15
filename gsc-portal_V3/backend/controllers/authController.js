import express from "express";
import mysql from "mysql2/promise";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// ✅ 데이터베이스 연결 설정
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// ✅ JWT 토큰 생성 함수
const generateAccessToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.ACCESS_SECRET,
    { expiresIn: "1h" } // Access Token 1시간 유효
  );

const generateRefreshToken = (user) =>
  jwt.sign(
    { id: user.id },
    process.env.REFRESH_SECRET,
    { expiresIn: "7d" } // Refresh Token 7일 유효
  );

// ✅ 1️⃣ 회원가입 요청 (승인 대기)
export const registerUser = async (req, res) => {
  const { email, studentid, phone, year, status, role, picture, name } =
    req.body;

  try {
    const connection = await mysql.createConnection(dbConfig);

    // ✅ 이미 승인된 사용자인지 확인
    const [existingUser] = await connection.query(
      "SELECT * FROM users WHERE email = ? OR studentid = ?",
      [email, studentid]
    );
    if (existingUser.length > 0) {
      await connection.end();
      return res.status(400).json({ message: "이미 승인된 사용자입니다." });
    }

    // ✅ 이미 회원가입 신청한 사용자 확인
    const [existingRegistration] = await connection.query(
      "SELECT * FROM registrations WHERE email = ? OR studentid = ?",
      [email, studentid]
    );
    if (existingRegistration.length > 0) {
      await connection.end();
      return res
        .status(400)
        .json({ message: "이미 회원가입 신청이 접수되었습니다." });
    }

    // ✅ `registrations` 테이블에 회원정보 저장 (승인 대기)
    await connection.query(
      `INSERT INTO registrations (email, studentid, phone, year, status, role, picture, name) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,

      [email, studentid, phone, year, status, role, picture, name]
    );

    await connection.end();
    res.status(201).json({
      message:
        "회원가입 신청이 완료되었습니다. 관리자 승인 후 이용 가능합니다.",
    });
  } catch (error) {
    console.error("❌ 회원가입 오류:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

// ✅ 2️⃣ 로그인 API (Google OAuth 사용)
export const loginUser = async (req, res) => {
  const { email } = req.body;

  try {
    const connection = await mysql.createConnection(dbConfig);

    // ✅ `users` 테이블에서 사용자 조회 (승인된 사용자만 가능)
    const [user] = await connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (user.length === 0) {
      await connection.end();
      return res.status(401).json({ message: "관리자 승인이 필요합니다." });
    }

    // ✅ Access Token & Refresh Token 발급
    const accessToken = generateAccessToken(user[0]);
    const refreshToken = generateRefreshToken(user[0]);

    // ✅ Refresh Token을 users 테이블에 저장
    await connection.query(
      "UPDATE users SET refresh_token = ? WHERE email = ?",
      [refreshToken, email]
    );

    await connection.end();
    res.json({
      message: "로그인 성공",
      accessToken,
      refreshToken,
      user: user[0],
    });
  } catch (error) {
    console.error("❌ 로그인 오류:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};
