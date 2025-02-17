const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

// 📌 1️⃣ 미들웨어 설정
app.use(cors());
app.use(bodyParser.json());

// 📌 2️⃣ MySQL 데이터베이스 연결 설정
const db = mysql.createConnection({
    host: "localhost",
    user: "root",         // MySQL 사용자 이름
    password: "password", // MySQL 비밀번호
    database: "mydatabase" // 사용할 데이터베이스
});

// 📌 3️⃣ MySQL 연결 테스트
db.connect((err) => {
    if (err) {
        console.error("❌ MySQL 연결 실패:", err);
        return;
    }
    console.log("✅ MySQL 데이터베이스 연결 성공!");
});

// 📌 4️⃣ 기본 API 엔드포인트
app.get("/", (req, res) => {
    res.send("Hello, Express & MySQL!");
});

// 📌 5️⃣ 사용자 목록 조회 API (Read)
app.get("/api/users", (req, res) => {
    const sql = "SELECT * FROM users";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 📌 6️⃣ 사용자 추가 API (Create)
app.post("/api/users", (req, res) => {
    const { name, email } = req.body;
    const sql = "INSERT INTO users (name, email) VALUES (?, ?)";
    db.query(sql, [name, email], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "사용자 추가 성공!", id: result.insertId });
    });
});

// 📌 7️⃣ 사용자 수정 API (Update)
app.put("/api/users/:id", (req, res) => {
    const { name, email } = req.body;
    const { id } = req.params;
    const sql = "UPDATE users SET name = ?, email = ? WHERE id = ?";
    db.query(sql, [name, email, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "사용자 정보 수정 완료!" });
    });
});

// 📌 8️⃣ 사용자 삭제 API (Delete)
app.delete("/api/users/:id", (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM users WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "사용자 삭제 완료!" });
    });
});

// 📌 9️⃣ 서버 실행
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});
