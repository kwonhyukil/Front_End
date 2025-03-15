import { pool } from "../config/db.js";

// ✅ 시간표 조회
export const getSchedule = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id, course_name, professor, classroom, day, 
             TIME_FORMAT(start_time, '%H:%i') AS start_time, duration, year,
             CASE 
               WHEN TIME_FORMAT(start_time, '%H:%i') = '09:00' THEN 1
               WHEN TIME_FORMAT(start_time, '%H:%i') = '10:00' THEN 2
               WHEN TIME_FORMAT(start_time, '%H:%i') = '11:00' THEN 3
               WHEN TIME_FORMAT(start_time, '%H:%i') = '12:00' THEN 4
               WHEN TIME_FORMAT(start_time, '%H:%i') = '13:00' THEN 5
               WHEN TIME_FORMAT(start_time, '%H:%i') = '14:00' THEN 6
               WHEN TIME_FORMAT(start_time, '%H:%i') = '15:00' THEN 7
               WHEN TIME_FORMAT(start_time, '%H:%i') = '16:00' THEN 8
               WHEN TIME_FORMAT(start_time, '%H:%i') = '17:00' THEN 9
               WHEN TIME_FORMAT(start_time, '%H:%i') = '18:00' THEN 10
             END AS period
      FROM schedule
    `);
    res.json({ schedule: rows });
  } catch (error) {
    console.error("❌ 시간표 불러오기 오류:", error);
    res.status(500).json({ error: "시간표 데이터를 불러오는 중 오류 발생" });
  }
};

// ✅ 새 강의 추가
export const addSchedule = async (req, res, io) => {
  const { course_name, professor, classroom, day, start_time, duration, year } = req.body;

  if (!course_name || !professor || !classroom || !day || !start_time || !duration || !year) {
    return res.status(400).json({ error: "모든 필드를 입력해야 합니다." });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO schedule (course_name, professor, classroom, day, start_time, duration, year) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [course_name, professor, classroom, day, start_time, duration, year]
    );

    io.emit("scheduleUpdated", await pool.query(`SELECT * FROM schedule`)); // ✅ 실시간 업데이트
    res.json({ message: "시간표가 추가되었습니다." });
  } catch (error) {
    console.error("❌ 시간표 추가 오류:", error);
    res.status(500).json({ error: "시간표 추가 중 오류 발생" });
  }
};

// ✅ 시간표 삭제
export const deleteSchedule = async (req, res, io) => {
  const { id } = req.params;

  try {
    await pool.query(`DELETE FROM schedule WHERE id = ?`, [id]);
    io.emit("scheduleUpdated", await pool.query(`SELECT * FROM schedule`)); // ✅ 실시간 업데이트
    res.json({ message: "시간표가 삭제되었습니다." });
  } catch (error) {
    console.error("❌ 시간표 삭제 오류:", error);
    res.status(500).json({ error: "시간표 삭제 중 오류 발생" });
  }
};
