const express = require("express");
const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, (req, res) => {
  db.query("SELECT * FROM notices ORDER BY created_at DESC", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

router.post("/", authMiddleware, (req, res) => {
  if (req.user.role !== "professor" && req.user.role !== "admin") {
    return res.status(403).json({ message: "권한이 없습니다." });
  }

  const { title, content } = req.body;
  db.query(
    "INSERT INTO notices (title, content, author) VALUES (?, ?, ?)",
    [title, content, req.user.id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "공지사항 등록 완료" });
    }
  );
});

module.exports = router;
