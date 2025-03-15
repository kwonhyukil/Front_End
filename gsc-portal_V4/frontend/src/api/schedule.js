// 📄 frontend/src/api/schedule.js
// ✅ Axios를 활용한 시간표 API 요청 관리
import axios from "axios";

// ✅ 환경변수에서 API 기본 URL 가져오기
const baseURL = import.meta.env.VITE_API_URL;

/**
 * ✅ 학년별 시간표 조회
 * @param {string} grade - 학년 필터 ("1", "2", "3" 또는 "all")
 * @returns {Promise<Array>} - 해당 학년의 시간표 목록 반환
 */
export const fetchSchedules = async (grade = "all") => {
  const res = await axios.get(`${baseURL}/schedule`, { params: { grade } });
  return res.data;
};

/**
 * ✅ 시간표 등록 (교수/관리자만 가능)
 * @param {string} token - JWT 인증 토큰
 * @param {Object} payload - 시간표 데이터 (과목명, 교수, 강의실, 요일, 시간 등)
 * @returns {Promise<Object>} - 생성된 시간표 반환
 */
export const createScheduleRequest = async (token, payload) => {
  const res = await axios.post(`${baseURL}/schedule`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

/**
 * ✅ 시간표 수정 (교수/관리자만 가능)
 * @param {string} token - JWT 인증 토큰
 * @param {number} id - 수정할 시간표 ID
 * @param {Object} payload - 수정할 데이터 (과목명, 교수, 시간 등)
 * @returns {Promise<Object>} - 수정된 시간표 반환
 */
export const updateScheduleRequest = async (token, id, payload) => {
  const res = await axios.put(`${baseURL}/schedule/${id}`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

/**
 * ✅ 시간표 삭제 (교수/관리자만 가능)
 * @param {string} token - JWT 인증 토큰
 * @param {number} id - 삭제할 시간표 ID
 * @returns {Promise<Object>} - 삭제 결과 반환
 */
export const deleteScheduleRequest = async (token, id) => {
  const res = await axios.delete(`${baseURL}/schedule/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
