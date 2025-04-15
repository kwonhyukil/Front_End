// [경로: frontend/src/api/schedule.js]
import axios from "axios";
const baseURL = import.meta.env.VITE_API_URL;

// 시간표 조회
export const getSchedules = async (grade = "all") => {
  const res = await axios.get(`${baseURL}/api/schedule`, {
    params: { grade },
  });
  return res.data;
};

// 등록
export const createScheduleRequest = async (token, payload) => {
  const res = await axios.post(`${baseURL}/api/schedule`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// 수정
export const updateScheduleRequest = async (token, id, payload) => {
  const res = await axios.put(`${baseURL}/api/schedule/${id}`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// 삭제
export const deleteScheduleRequest = async (token, id) => {
  const res = await axios.delete(`${baseURL}/api/schedule/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
