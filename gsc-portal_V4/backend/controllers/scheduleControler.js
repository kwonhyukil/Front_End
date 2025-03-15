import pool from "../config/db.js"; // MySQL 데이터베이스 연결 풀

/**
 * ✅ 정규 시간표 조회
 * - 학년별 필터 (`?grade=1,2,3 or all`)
 * - 요일(월~토) + 시작 시간 기준 정렬
 */
export const getSchedules = async (req, res) => {
  try {
    const grade = req.query.grade || ""; // 학년 필터 값 (기본값: 없음)
    let query = "SELECT * FROM class_schedules";
    const params = [];

    // 특정 학년(grade_year) 필터 적용
    if (grade && grade !== "all") {
      query += " WHERE grade_year=?";
      params.push(grade);
    }

    // 요일(월~토) 순서 + 시작 시간 순서로 정렬
    query +=
      " ORDER BY FIELD(day_of_week,'월','화','수','목','금','토'), start_time";

    const [rows] = await pool.query(query, params);
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ error: "시간표 조회 오류" });
  }
};

/**
 * ✅ 시간표 등록
 * - 관리자(1), 교수(2)만 가능
 * - start_time ~ end_time 중복 체크 (같은 요일 & 학년 내에서 중복 불가)
 */
export const createSchedule = async (req, res) => {
  try {
    if (![1, 2].includes(req.user.role_id)) {
      return res.status(403).json({ error: "권한 없음" });
    }

    // 요청 데이터 가져오기
    const {
      subject_name,
      professor_name,
      classroom,
      day_of_week,
      start_time,
      end_time,
      grade_year,
    } = req.body;

    // ✅ 같은 요일과 학년 내에서 시간 중복 체크
    const [checkRows] = await pool.query(
      `SELECT * FROM class_schedules 
       WHERE day_of_week=? AND grade_year=?
       AND ((start_time < ? AND end_time > ?) OR (start_time < ? AND end_time > ?))`,
      [day_of_week, grade_year, end_time, start_time, end_time, start_time]
    );

    if (checkRows.length > 0) {
      return res
        .status(400)
        .json({ error: "이미 해당 시간에 과목이 존재합니다." });
    }

    // ✅ 시간표 등록 (DB 삽입)
    await pool.query(
      `INSERT INTO class_schedules
       (subject_name, professor_name, classroom, day_of_week, start_time, end_time, grade_year)
       VALUES (?,?,?,?,?,?,?)`,
      [
        subject_name,
        professor_name,
        classroom,
        day_of_week,
        start_time,
        end_time,
        grade_year,
      ]
    );

    return res.json({ message: "시간표 등록 완료" });
  } catch (error) {
    return res.status(500).json({ error: "시간표 등록 오류" });
  }
};

/**
 * ✅ 시간표 수정
 * - 관리자(1), 교수(2)만 가능
 * - 기존 시간표와 중복되지 않도록 확인 후 업데이트
 */
export const updateSchedule = async (req, res) => {
  try {
    if (![1, 2].includes(req.user.role_id)) {
      return res.status(403).json({ error: "권한 없음" });
    }

    const scheduleId = req.params.id;
    const {
      subject_name,
      professor_name,
      classroom,
      day_of_week,
      start_time,
      end_time,
      grade_year,
    } = req.body;

    // ✅ 중복 체크 (자신을 제외한 동일 요일 & 학년 내에서 중복 여부 확인)
    const [checkRows] = await pool.query(
      `SELECT * FROM class_schedules
       WHERE id!=? AND day_of_week=? AND grade_year=?
       AND ((start_time < ? AND end_time > ?) OR (start_time < ? AND end_time > ?))`,
      [
        scheduleId,
        day_of_week,
        grade_year,
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

    // ✅ 시간표 수정
    await pool.query(
      `UPDATE class_schedules SET
       subject_name=?, professor_name=?, classroom=?, day_of_week=?, start_time=?, end_time=?, grade_year=?
       WHERE id=?`,
      [
        subject_name,
        professor_name,
        classroom,
        day_of_week,
        start_time,
        end_time,
        grade_year,
        scheduleId,
      ]
    );

    return res.json({ message: "시간표 수정 완료" });
  } catch (error) {
    return res.status(500).json({ error: "시간표 수정 오류" });
  }
};

/**
 * ✅ 시간표 삭제
 * - 관리자(1), 교수(2)만 가능
 */
export const deleteSchedule = async (req, res) => {
  try {
    if (![1, 2].includes(req.user.role_id)) {
      return res.status(403).json({ error: "권한 없음" });
    }

    const scheduleId = req.params.id;

    // ✅ 특정 시간표 삭제
    await pool.query("DELETE FROM class_schedules WHERE id=?", [scheduleId]);

    return res.json({ message: "삭제 완료" });
  } catch (error) {
    return res.status(500).json({ error: "시간표 삭제 오류" });
  }
};
