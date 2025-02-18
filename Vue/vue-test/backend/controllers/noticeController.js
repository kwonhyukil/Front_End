const pool = require("../config/database");

// 공지사항 목록 조회
exports.getNotices = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM notices ORDER BY created_at DESC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "데이터 조회 오류" });
  }
};

// 공지사항 추가
exports.createNotice = async (req, res) => {
  const { title, content } = req.body;
  try {
    await pool.query("INSERT INTO notices (title, content) VALUES (?, ?)", [title, content]);
    res.status(201).json({ message: "공지사항 추가 완료" });
  } catch (error) {
    res.status(500).json({ error: "데이터 저장 오류" });
  }
};
