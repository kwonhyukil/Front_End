// 📄 frontend/src/api/timetable.js
/*
  ✅ 시간표 관련 API 요청 처리 모듈
*/
import axios from "axios";

// ✅ 환경변수에서 API 기본 URL 가져오기
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * ✅ 전체 시간표 조회 (요일 & 시간순 정렬)
 * @returns {Promise<Array>} - 시간표 목록 반환
 */
export const fetchAllTimetables = async () => {
  const res = await axios.get(`${baseURL}/timetables`);
  return res.data;
};

/**
 * ✅ 새로운 시간표 등록 (교수/관리자만 가능)
 * @param {string} token - JWT 인증 토큰
 * @param {Object} payload - 시간표 데이터 (과목명, 교수, 요일, 시간 등)
 * @returns {Promise<Object>} - 등록된 시간표 정보 반환
 */
export const createTimetableRequest = async (token, payload) => {
  const res = await axios.post(`${baseURL}/timetables`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
