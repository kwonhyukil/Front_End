import { pool } from "../config/db.js";

// ✅ 전체 시간표 불러오기 (수정된 버전)
export const getSchedule = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id, course_name, professor, classroom, day, 
             start_time, duration, year,
             CASE 
               WHEN start_time = '09:00:00' THEN 1
               WHEN start_time = '10:00:00' THEN 2
               WHEN start_time = '11:00:00' THEN 3
               WHEN start_time = '12:00:00' THEN 4
               WHEN start_time = '13:00:00' THEN 5
               WHEN start_time = '14:00:00' THEN 6
               WHEN start_time = '15:00:00' THEN 7
               WHEN start_time = '16:00:00' THEN 8
               WHEN start_time = '17:00:00' THEN 9
               WHEN start_time = '18:00:00' THEN 10
             END AS period
      FROM schedule
    `);

    console.log("📌 불러온 데이터:", rows); // 👀 디버깅용 로그
    res.json({ schedule: rows });
  } catch (error) {
    console.error("❌ 시간표 불러오기 오류:", error);
    res.status(500).json({ error: "시간표 데이터를 불러오는 중 오류 발생" });
  }
};

// ✅ 새 강의 추가 (자동으로 period 값 계산)
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
    // 📌 start_time을 period로 변환
    const periodMap = {
      "09:00:00": 1,
      "10:00:00": 2,
      "11:00:00": 3,
      "12:00:00": 4,
      "13:00:00": 5,
      "14:00:00": 6,
      "15:00:00": 7,
      "16:00:00": 8,
      "17:00:00": 9,
      "18:00:00": 10,
    };
    const period = periodMap[start_time] || null;

    if (!period) {
      return res.status(400).json({ error: "올바른 시작 시간을 입력하세요." });
    }

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
