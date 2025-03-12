import { pool } from "../config/db.js";

// ✅ 시간표 조회 (수정)
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
export const addSchedule = async (req, res) => {
  const { course_name, professor, classroom, day, start_time, duration, year } =
    req.body;

  if (
    !course_name ||
    !professor ||
    !classroom ||
    !day ||
    !start_time ||
    !duration ||
    !year
  ) {
    return res.status(400).json({ error: "모든 필드를 입력해야 합니다." });
  }

  try {
    const periodMap = {
      "09:00": 1,
      "10:00": 2,
      "11:00": 3,
      "12:00": 4,
      "13:00": 5,
      "14:00": 6,
      "15:00": 7,
      "16:00": 8,
      "17:00": 9,
      "18:00": 10,
    };
    const period = periodMap[start_time.substring(0, 5)] || null;

    await pool.query(
      `INSERT INTO schedule (course_name, professor, classroom, day, start_time, duration, year, period)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,

      [
        course_name,
        professor,
        classroom,
        day,
        start_time,
        duration,
        year,
        period,
      ]
    );

    res.json({ message: "시간표가 추가되었습니다." });
  } catch (error) {
    console.error("❌ 시간표 추가 오류:", error);
    res.status(500).json({ error: "시간표 추가 중 오류 발생" });
  }
};
