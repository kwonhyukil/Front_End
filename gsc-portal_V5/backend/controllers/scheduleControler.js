// [경로: backend/controllers/scheduleController.js]
import pool from "../config/db.js";

/**
 * 시간표 조회
 * - grade=1,2,3 or all
 */
export const getSchedules = async (req, res) => {
  try {
    const { grade } = req.query;
    let query = "SELECT s.* FROM schedules s";
    const params = [];

    if (grade && grade !== "all") {
      query += " JOIN grades g ON s.grade_id=g.id WHERE g.grade_level=?";
      params.push(grade);
    }
    // 요일, start_time 정렬
    query +=
      (params.length > 0 ? " " : " WHERE 1 ") +
      " ORDER BY FIELD(day_of_week,'월','화','수','목','금','토'), start_time";

    const [rows] = await pool.query(query, params);
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ error: "시간표 조회 오류" });
  }
};

/**
 * 시간표 등록
 * repeat_weekly=true 시, 주 단위 반복(추가 구현 가능)
 */
export const createSchedule = async (req, res) => {
  try {
    // 관리자(1) or 교수(2)만
    if (![1, 2].includes(req.user.role_id)) {
      return res.status(403).json({ error: "권한 없음" });
    }
    const {
      course_name,
      professor_name,
      room,
      day_of_week,
      start_time,
      end_time,
      grade_id,
      repeat_weekly,
    } = req.body;

    // 중복 체크 예시
    const [checkRows] = await pool.query(
      `SELECT * FROM schedules
       WHERE grade_id=? AND day_of_week=?
       AND ((start_time < ? AND end_time > ?) OR (start_time < ? AND end_time > ?))`,
      [grade_id, day_of_week, end_time, start_time, end_time, start_time]
    );
    if (checkRows.length > 0) {
      return res
        .status(400)
        .json({ error: "이미 해당 시간에 과목이 존재합니다." });
    }

    await pool.query(
      `INSERT INTO schedules
       (course_name, professor_name, room, day_of_week, start_time, end_time, grade_id, repeat_weekly)
       VALUES (?,?,?,?,?,?,?,?)`,
      [
        course_name,
        professor_name,
        room,
        day_of_week,
        start_time,
        end_time,
        grade_id,
        repeat_weekly,
      ]
    );
    return res.json({ message: "시간표 등록 완료" });
  } catch (error) {
    return res.status(500).json({ error: "시간표 등록 오류" });
  }
};

/**
 * 시간표 수정
 */
export const updateSchedule = async (req, res) => {
  try {
    if (![1, 2].includes(req.user.role_id)) {
      return res.status(403).json({ error: "권한 없음" });
    }
    const scheduleId = req.params.id;
    const {
      course_name,
      professor_name,
      room,
      day_of_week,
      start_time,
      end_time,
      grade_id,
      repeat_weekly,
    } = req.body;

    // 중복 체크
    const [checkRows] = await pool.query(
      `SELECT * FROM schedules
       WHERE id!=? AND grade_id=? AND day_of_week=?
       AND ((start_time < ? AND end_time > ?) OR (start_time < ? AND end_time > ?))`,
      [
        scheduleId,
        grade_id,
        day_of_week,
        end_time,
        start_time,
        end_time,
        start_time,
      ]
    );
    if (checkRows.length > 0) {
      return res
        .status(400)
        .json({ error: "이미 해당 시간에 과목이 존재합니다." });
    }

    await pool.query(
      `UPDATE schedules SET
       course_name=?, professor_name=?, room=?, day_of_week=?, start_time=?, end_time=?, grade_id=?, repeat_weekly=?
       WHERE id=?`,
      [
        course_name,
        professor_name,
        room,
        day_of_week,
        start_time,
        end_time,
        grade_id,
        repeat_weekly,
        scheduleId,
      ]
    );
    return res.json({ message: "시간표 수정 완료" });
  } catch (error) {
    return res.status(500).json({ error: "시간표 수정 오류" });
  }
};

/**
 * 시간표 삭제
 */
export const deleteSchedule = async (req, res) => {
  try {
    if (![1, 2].includes(req.user.role_id)) {
      return res.status(403).json({ error: "권한 없음" });
    }
    const scheduleId = req.params.id;
    await pool.query("DELETE FROM schedules WHERE id=?", [scheduleId]);
    return res.json({ message: "시간표 삭제 완료" });
  } catch (error) {
    return res.status(500).json({ error: "시간표 삭제 오류" });
  }
};
