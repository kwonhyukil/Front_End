import { pool } from "../config/db.js";

/**
 * ✅ 학과 행사 일정 조회
 */
export const getEvents = async (req, res) => {
  try {
    const [events] = await pool.query(
      "SELECT * FROM events ORDER BY event_date ASC"
    );
    res.status(200).json(events);
  } catch (error) {
    console.error("❌ 행사 일정 조회 오류:", error);
    res.status(500).json({ error: "학과 행사 일정 조회 중 오류 발생" });
  }
};

/**
 * ✅ 학과 행사 일정 추가
 */
export const createEvent = async (req, res) => {
  const { title, description, event_date, created_by } = req.body;

  if (!title || !description || !event_date || !created_by) {
    return res.status(400).json({ error: "모든 필드를 입력해야 합니다." });
  }

  try {
    await pool.query(
      `INSERT INTO events (title, description, event_date, created_by) VALUES (?, ?, ?, ?)`,
      [title, description, event_date, created_by]
    );
    res.status(201).json({ message: "행사 일정이 추가되었습니다." });
  } catch (error) {
    console.error("❌ 행사 일정 추가 오류:", error);
    res.status(500).json({ error: "학과 행사 일정 추가 중 오류 발생" });
  }
};

/**
 * ✅ 학과 행사 일정 수정
 */
export const updateEvent = async (req, res) => {
  const { id } = req.params;
  const { title, description, event_date } = req.body;

  if (!title || !description || !event_date) {
    return res.status(400).json({ error: "모든 필드를 입력해야 합니다." });
  }

  try {
    const [result] = await pool.query(
      "UPDATE events SET title = ?, description = ?, event_date = ? WHERE id = ?",
      [title, description, event_date, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "일정을 찾을 수 없습니다." });
    }

    res.status(200).json({ message: "행사 일정이 수정되었습니다." });
  } catch (error) {
    console.error("❌ 행사 일정 수정 오류:", error);
    res.status(500).json({ error: "학과 행사 일정 수정 중 오류 발생" });
  }
};

/**
 * ✅ 학과 행사 일정 삭제
 */
export const deleteEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query("DELETE FROM events WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "일정을 찾을 수 없습니다." });
    }

    res.status(200).json({ message: "행사 일정이 삭제되었습니다." });
  } catch (error) {
    console.error("❌ 행사 일정 삭제 오류:", error);
    res.status(500).json({ error: "학과 행사 일정 삭제 중 오류 발생" });
  }
};
