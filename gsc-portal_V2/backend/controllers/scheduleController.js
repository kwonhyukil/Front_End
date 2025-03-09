import { pool } from "../config/db.js";

// 🔹 사용자 학년에 맞는 시간표 조회
export const getScheduleByUser = async (req, res) => {
  try {
    const { email, year } = req.user;

    const [rows] = await pool.query("SELECT * FROM schedule WHERE year = ?", [
      year,
    ]);

    res.json({ schedule: rows });
  } catch (error) {
    res.status(500).json({ error: "시간표 불러오기 실패" });
  }
};

// 🔹 시간표 추가 (교수/관리자만 가능)
export const addSchedule = async (req, res) => {
  try {
    const { name, professor, classroom, day, time, year } = req.body;

    await pool.query(
      "INSERT INTO schedule (name, professor, classroom, day, time, year) VALUES (?, ?, ?, ?, ?, ?)",
      [name, professor, classroom, day, time, year]
    );

    res.json({ message: "시간표 추가 성공" });
  } catch (error) {
    res.status(500).json({ error: "시간표 추가 실패" });
  }
};
