import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { OAuth2Client } from "google-auth-library";
import mysql from "mysql2";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

console.log("✅ 환경 변수 확인:", process.env.GOOGLE_CLIENT_ID);

// 🔹 환경변수 로드
dotenv.config();

console.log("✅ 환경 변수 확인:", process.env.GOOGLE_CLIENT_ID); // 환경 변수 로드 여부 확인

const app = express();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// 🔹 미들웨어 설정
app.use(express.json());
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Vue 개발 서버 허용
    methods: "GET,POST",
    credentials: true,
  })
);

// 🔹 MySQL 연결
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL 연결 실패:", err.message);
    return;
  }
  console.log("✅ MySQL 연결 성공!");

  // 🔹 users 테이블이 없으면 자동 생성
  db.query(
    `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      google_id VARCHAR(255) NOT NULL UNIQUE,
      name VARCHAR(255),
      email VARCHAR(255),
      picture TEXT,
      last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    (err) => {
      if (err) console.error("❌ 테이블 생성 오류:", err.message);
      else console.log("✅ 'users' 테이블 확인 완료!");
    }
  );
});

// 🔹 Google 로그인 API
app.post("/auth/google", async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub } = payload;

    db.query(
      "SELECT * FROM users WHERE google_id = ?",
      [sub],
      (err, results) => {
        if (err) {
          console.error("❌ DB 오류:", err.message);
          return res.status(500).json({ error: "DB 오류" });
        }

        if (results.length > 0) {
          // 🔹 기존 회원 로그인 처리
          db.query(
            "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE google_id = ?",
            [sub]
          );
          return res.json({ message: "로그인 성공", user: results[0] });
        } else {
          // 🔹 신규 회원 가입
          db.query(
            "INSERT INTO users (google_id, name, email, picture) VALUES (?, ?, ?, ?)",
            [sub, name, email, picture],
            (err, result) => {
              if (err) {
                console.error("❌ DB 저장 오류:", err.message);
                return res.status(500).json({ error: "DB 저장 오류" });
              }

              res.json({
                message: "회원가입 성공",
                user: {
                  id: result.insertId,
                  google_id: sub,
                  name,
                  email,
                  picture,
                },
              });
            }
          );
        }
      }
    );
  } catch (error) {
    console.error("❌ 토큰 검증 실패:", error.message);
    res.status(401).json({ error: "토큰 검증 실패", details: error.message });
  }
});

// 🔹 서버 실행
const PORT = process.env.PORT || 5001;
app.listen(PORT, () =>
  console.log(`🚀 서버 실행 중: http://localhost:${PORT}`)
);
