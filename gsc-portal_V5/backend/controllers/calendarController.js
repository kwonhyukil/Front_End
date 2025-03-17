// [경로: backend/controllers/calendarController.js]
import pool from "../config/db.js";
// Google API 연동은 실제로는 googleapis 라이브러리 필요
// 여기서는 DB 연동 예시만 작성

/**
 * 일정 조회
 * - 특정 달만 필터링할 수도 있음
 */
export const getCalendarEvents = async (req, res) => {
  try {
    // 예: ?month=2025-03
    // 여기서는 단순히 모든 이벤트 반환
    const [rows] = await pool.query(
      "SELECT * FROM calendar_events ORDER BY event_date ASC"
    );
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ error: "일정 조회 오류" });
  }
};

/**
 * 일정 생성 + Google 캘린더 API
 */
export const createCalendarEvent = async (req, res) => {
  try {
    // 관리자/교수만 등록 가능(예시) or 학생도 가능하게 할지 결정
    if (![1, 2].includes(req.user.role_id)) {
      return res.status(403).json({ error: "일정 등록 권한 없음" });
    }
    const { title, description, event_date } = req.body;
    const createdBy = req.user.id;

    // 1) DB 저장
    const [result] = await pool.query(
      `INSERT INTO calendar_events (title, description, event_date, created_by)
       VALUES (?,?,?,?)`,
      [title, description, event_date, createdBy]
    );
    const eventId = result.insertId;

    // 2) Google Calendar API 호출 → google_event_id 업데이트
    // 실제 구현 시 googleapis로 event insert
    // 여기서는 예시
    const google_event_id = "fake_google_event_id_123";
    await pool.query(
      "UPDATE calendar_events SET google_event_id=? WHERE id=?",
      [google_event_id, eventId]
    );

    return res.json({ message: "일정 등록 완료", event_id: eventId });
  } catch (error) {
    return res.status(500).json({ error: "일정 등록 오류" });
  }
};

/**
 * 일정 수정
 */
export const updateCalendarEvent = async (req, res) => {
  try {
    if (![1, 2].includes(req.user.role_id)) {
      return res.status(403).json({ error: "일정 수정 권한 없음" });
    }
    const eventId = req.params.id;
    const { title, description, event_date } = req.body;
    // DB 수정
    await pool.query(
      `UPDATE calendar_events SET title=?, description=?, event_date=?
       WHERE id=?`,
      [title, description, event_date, eventId]
    );
    // Google Calendar API도 수정
    return res.json({ message: "일정 수정 완료" });
  } catch (error) {
    return res.status(500).json({ error: "일정 수정 오류" });
  }
};

/**
 * 일정 삭제
 */
export const deleteCalendarEvent = async (req, res) => {
  try {
    if (![1, 2].includes(req.user.role_id)) {
      return res.status(403).json({ error: "일정 삭제 권한 없음" });
    }
    const eventId = req.params.id;
    // DB 삭제
    await pool.query("DELETE FROM calendar_events WHERE id=?", [eventId]);
    // Google Calendar API도 삭제
    return res.json({ message: "일정 삭제 완료" });
  } catch (error) {
    return res.status(500).json({ error: "일정 삭제 오류" });
  }
};
