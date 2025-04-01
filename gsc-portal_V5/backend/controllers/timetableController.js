import pool from "../config/db.js";

// ✅ 요일 순 정렬
const ORDER_BY_DAY = `FIELD(day_of_week, '월','화','수','목','금','토')`;

/**
 * 특정 주차 시간표 조회
 */
export const getAllTimetables = async (req, res) => {
  try {
    const { grade } = req.query;
    let sql = `SELECT * FROM timetables`;
    const params = [];

    if (grade && grade !== "all") {
      sql += " WHERE grade_id = ?";
      params.push(Number(grade));
    }

    sql += ` ORDER BY ${ORDER_BY_DAY}, start_time`;

    const [rows] = await pool.query(sql, params);
    return res.json(rows);
  } catch (err) {
    console.error("❌ 시간표 조회 오류:", err);
    return res.status(500).json({ error: "시간표 조회 오류" });
  }
};

export const createTimetable = async (req, res) => {
  try {
    if (![1, 2].includes(req.user.role_id)) {
      return res.status(403).json({ error: "시간표 등록 권한 없음" });
    }

    const {
      course_name,
      professor_id,
      professor_name,
      day_of_week,
      start_time,
      end_time,
      room,
      grade_id,
      custom_date,
      color_code,
      schedule_type = "일반",
    } = req.body;

    // 필수 필드 검증
    if (
      !course_name ||
      !professor_id ||
      !professor_name ||
      !day_of_week ||
      !start_time ||
      !end_time ||
      !room ||
      !grade_id
    ) {
      return res.status(400).json({ error: "필수 필드가 누락되었습니다." });
    }

    // 충돌 체크: 일반 수업만 주차 중복 체크
    if (!custom_date) {
      const [conflicts] = await pool.query(
        `SELECT * FROM timetables
         WHERE day_of_week = ? AND grade_id = ?
         AND (
           (start_time < ? AND end_time > ?)
         )`,
        [day_of_week, grade_id, end_time, start_time]
      );

      if (conflicts.length > 0) {
        return res
          .status(409)
          .json({ error: "해당 시간에 이미 수업이 존재합니다." });
      }
    }

    // 삽입
    await pool.query(
      `INSERT INTO timetables 
        (course_name, professor_id, professor_name, day_of_week, start_time, end_time, room, grade_id, custom_date, color_code, schedule_type)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        course_name,
        professor_id,
        professor_name,
        day_of_week,
        start_time,
        end_time,
        room,
        grade_id,
        custom_date || null,
        color_code || null,
        schedule_type,
      ]
    );

    return res.status(201).json({ message: "시간표 등록 완료" });
  } catch (err) {
    console.error("❌ 시간표 등록 오류:", err);
    return res.status(500).json({ error: "시간표 등록 오류" });
  }
};

export const updateTimetable = async (req, res) => {
  try {
    if (![1, 2].includes(req.user.role_id)) {
      return res.status(403).json({ error: "시간표 수정 권한 없음" });
    }

    const id = req.params.id;
    const {
      course_name,
      professor_name,
      day_of_week,
      start_time,
      end_time,
      room,
      grade_id,
      custom_date,
      color_code,
      schedule_type = "일반",
    } = req.body;

    if (
      !course_name ||
      !professor_name ||
      !day_of_week ||
      !start_time ||
      !end_time ||
      !room ||
      !grade_id
    ) {
      return res.status(400).json({ error: "필수 필드가 누락되었습니다." });
    }

    const [conflicts] = await pool.query(
      `SELECT * FROM timetables 
       WHERE id != ? AND day_of_week = ? AND grade_id = ?
       AND (
         (start_time < ? AND end_time > ?)
       )`,
      [id, day_of_week, grade_id, end_time, start_time]
    );

    if (conflicts.length > 0) {
      return res
        .status(409)
        .json({ error: "해당 시간에 이미 수업이 존재합니다." });
    }

    await pool.query(
      `UPDATE timetables SET
        course_name = ?, professor_name = ?, day_of_week = ?, start_time = ?, end_time = ?,
        room = ?, grade_id = ?, custom_date = ?, color_code = ?, schedule_type = ?
       WHERE id = ?`,
      [
        course_name,
        professor_name,
        day_of_week,
        start_time,
        end_time,
        room,
        grade_id,
        custom_date || null,
        color_code || null,
        schedule_type,
        id,
      ]
    );

    return res.json({ message: "시간표 수정 완료" });
  } catch (err) {
    console.error("❌ 시간표 수정 오류:", err);
    return res.status(500).json({ error: "시간표 수정 오류" });
  }
};

export const deleteTimetable = async (req, res) => {
  try {
    if (![1, 2].includes(req.user.role_id)) {
      return res.status(403).json({ error: "시간표 삭제 권한 없음" });
    }

    const id = req.params.id;
    await pool.query(`DELETE FROM timetables WHERE id = ?`, [id]);
    return res.json({ message: "시간표 삭제 완료" });
  } catch (err) {
    console.error("❌ 시간표 삭제 오류:", err);
    return res.status(500).json({ error: "시간표 삭제 오류" });
  }
};
