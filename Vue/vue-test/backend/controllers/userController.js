const pool = require("../config/database");

// 모든 사용자 조회
exports.getUsers = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users ORDER BY created_at DESC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "데이터 조회 오류" });
  }
};

// 사용자 추가
exports.addUser = async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "이름과 이메일을 입력하세요." });
  }

  try {
    await pool.query("INSERT INTO users (name, email) VALUES (?, ?)", [name, email]);
    res.status(201).json({ message: "사용자 추가 완료" });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "이미 존재하는 이메일입니다." });
    }
    res.status(500).json({ error: "데이터 저장 오류" });
  }
};
