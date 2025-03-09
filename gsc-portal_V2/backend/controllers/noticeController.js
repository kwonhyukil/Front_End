import { pool } from "../config/db.js";

/**
 * ✅ 공지사항 전체 목록 조회
 */
export const getNotices = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM notices ORDER BY created_at DESC"
    );
    res.json({ notices: rows });
  } catch (error) {
    console.error("❌ 공지사항 조회 오류:", error);
    res.status(500).json({ error: "공지사항을 불러오지 못했습니다." });
  }
};

/**
 * ✅ 특정 공지사항 상세 조회
 */
export const getNoticeById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM notices WHERE id = ?", [id]);

    if (rows.length === 0)
      return res
        .status(404)
        .json({ error: "해당 공지사항을 찾을 수 없습니다." });

    res.json({ notice: rows[0] });
  } catch (error) {
    console.error("❌ 공지사항 상세 조회 오류:", error);
    res.status(500).json({ error: "공지사항을 불러오지 못했습니다." });
  }
};

/**
 * ✅ 공지사항 작성 (교수 & 관리자만 가능)
 */
export const createNotice = async (req, res) => {
  try {
    const { title, content, created_by } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "제목과 내용을 입력하세요." });
    }

    await pool.query(
      "INSERT INTO notices (title, content, created_by) VALUES (?, ?, ?)",
      [title, content, created_by]
    );

    res.status(201).json({ message: "공지사항이 등록되었습니다." });
  } catch (error) {
    console.error("❌ 공지사항 등록 오류:", error);
    res.status(500).json({ error: "공지사항을 등록하지 못했습니다." });
  }
};

/**
 * ✅ 공지사항 수정 (작성자만 가능)
 */
export const updateNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const [result] = await pool.query(
      "UPDATE notices SET title = ?, content = ? WHERE id = ?",
      [title, content, id]
    );

    if (result.affectedRows === 0)
      return res
        .status(404)
        .json({ error: "수정할 공지사항을 찾을 수 없습니다." });

    res.json({ message: "공지사항이 수정되었습니다." });
  } catch (error) {
    console.error("❌ 공지사항 수정 오류:", error);
    res.status(500).json({ error: "공지사항을 수정하지 못했습니다." });
  }
};

/**
 * ✅ 공지사항 삭제 (작성자만 가능)
 */
export const deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query("DELETE FROM notices WHERE id = ?", [id]);

    if (result.affectedRows === 0)
      return res
        .status(404)
        .json({ error: "삭제할 공지사항을 찾을 수 없습니다." });

    res.json({ message: "공지사항이 삭제되었습니다." });
  } catch (error) {
    console.error("❌ 공지사항 삭제 오류:", error);
    res.status(500).json({ error: "공지사항을 삭제하지 못했습니다." });
  }
};
