import pool from "../config/db.js"; // MySQL 연결 풀

/**
 * ✅ 전체 시간표 조회
 * - custom_date가 `null`: 기본 고정 시간표
 * - custom_date가 설정됨: 특정 날짜에 변경된 시간표
 */
export const getAllTimetables = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM timetables 
       ORDER BY FIELD(day_of_week, '월','화','수','목','금','토'), start_time`
    );
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ error: "시간표 조회 오류" });
  }
};

/**
 * ✅ 특정 요일별 시간표 조회
 * - 요일을 기반으로 시간표 필터링 (`월`, `화` 등)
 */
export const getTimetablesByDay = async (req, res) => {
  try {
    const { day_of_week } = req.params;
    const [rows] = await pool.query(
      `SELECT * FROM timetables WHERE day_of_week = ? ORDER BY start_time`,
      [day_of_week]
    );
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ error: "요일별 시간표 조회 오류" });
  }
};

/**
 * ✅ 새로운 시간표 등록 (교수/관리자만 가능)
 */
export const createTimetable = async (req, res) => {
  try {
    if (![1, 2].includes(req.user.role_id)) {
      return res.status(403).json({ error: "시간표 등록 권한이 없습니다." });
    }

    // 요청 데이터 가져오기
    const {
      course_name,
      professor_id,
      day_of_week,
      start_time,
      end_time,
      room,
      custom_date, // 특정 날짜에만 변경되는 시간표 (optional)
      color_code, // 시간표 색상 지정 (optional)
    } = req.body;

    // ✅ 시간표 등록 (DB 삽입)
    await pool.query(
      `INSERT INTO timetables (course_name, professor_id, day_of_week, start_time, end_time, room, custom_date, color_code)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,

      [
        course_name,
        professor_id,
        day_of_week,
        start_time,
        end_time,
        room,
        custom_date || null,
        color_code || null,
      ]
    );

    return res.json({ message: "시간표가 등록되었습니다." });
  } catch (error) {
    return res.status(500).json({ error: "시간표 등록 오류" });
  }
};

/**
 * ✅ 기존 시간표 수정 (교수/관리자만 가능)
 */
export const updateTimetable = async (req, res) => {
  try {
    if (![1, 2].includes(req.user.role_id)) {
      return res.status(403).json({ error: "시간표 수정 권한이 없습니다." });
    }

    const timetableId = req.params.id;
    const {
      course_name,
      professor_id,
      day_of_week,
      start_time,
      end_time,
      room,
      custom_date,
      color_code,
    } = req.body;

    // ✅ 시간표 수정 (DB 업데이트)
    await pool.query(
      `UPDATE timetables 
       SET course_name=?, professor_id=?, day_of_week=?, start_time=?, end_time=?, room=?, custom_date=?, color_code=?
       WHERE id=?`,

      [
        course_name,
        professor_id,
        day_of_week,
        start_time,
        end_time,
        room,
        custom_date,
        color_code,
        timetableId,
      ]
    );

    return res.json({ message: "시간표가 수정되었습니다." });
  } catch (error) {
    return res.status(500).json({ error: "시간표 수정 오류" });
  }
};

/**
 * ✅ 시간표 삭제 (교수/관리자만 가능)
 */
export const deleteTimetable = async (req, res) => {
  try {
    if (![1, 2].includes(req.user.role_id)) {
      return res.status(403).json({ error: "시간표 삭제 권한이 없습니다." });
    }

    const timetableId = req.params.id;

    // ✅ 특정 시간표 삭제 (DB에서 제거)
    await pool.query("DELETE FROM timetables WHERE id = ?", [timetableId]);

    return res.json({ message: "시간표가 삭제되었습니다." });
  } catch (error) {
    return res.status(500).json({ error: "시간표 삭제 오류" });
  }
};
