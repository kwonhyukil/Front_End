// [경로: frontend/src/api/calendar.js]
import axios from "axios";

const BASE_URL = "https://www.googleapis.com/calendar/v3/calendars";
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

const HOLIDAY_CALENDAR_ID =
  "ko.south_korea#holiday@group.v.calendar.google.com";
const ADMIN_CALENDAR_ID =
  "c_416fe2b0d99e9f6bcb5713def73d2afe4792552b9b6296d87edf0eb2e7b@group.calendar.google.com";

export const fetchEvents = async (calendarId, start, end) => {
  try {
    const res = await axios.get(
      `${BASE_URL}/${encodeURIComponent(calendarId)}/events`,
      {
        params: {
          key: API_KEY,
          timeMin: new Date(start).toISOString(),
          timeMax: new Date(end).toISOString(),
          singleEvents: true,
          orderBy: "startTime",
        },
      }
    );
    return res.data.items;
  } catch (error) {
    console.error("캘린더 이벤트 조회 오류:", error);
    throw new Error("캘린더 이벤트를 불러오는데 실패했습니다.");
  }
};

export const fetchHolidayEvents = async (start, end) => {
  return await fetchEvents(HOLIDAY_CALENDAR_ID, start, end);
};

export const fetchAdminCalendarEvents = async (start, end) => {
  return await fetchEvents(ADMIN_CALENDAR_ID, start, end);
};

export const createCalendarEvent = async (token, eventData) => {
  try {
    const res = await axios.post(`${BASE_URL}/primary/events`, eventData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    console.error("캘린더 이벤트 생성 오류:", error);
    throw new Error("캘린더 이벤트 생성에 실패했습니다.");
  }
};

export const updateCalendarEvent = async (token, eventId, eventData) => {
  try {
    const res = await axios.put(
      `${BASE_URL}/primary/events/${eventId}`,
      eventData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("캘린더 이벤트 수정 오류:", error);
    throw new Error("캘린더 이벤트 수정에 실패했습니다.");
  }
};

export const deleteCalendarEvent = async (token, eventId) => {
  try {
    await axios.delete(`${BASE_URL}/primary/events/${eventId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return true;
  } catch (error) {
    console.error("캘린더 이벤트 삭제 오류:", error);
    throw new Error("캘린더 이벤트 삭제에 실패했습니다.");
  }
};
