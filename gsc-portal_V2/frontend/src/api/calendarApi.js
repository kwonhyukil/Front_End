// 📂 frontend/src/api/calendarApi.js
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL + "/schedule";

// ✅ 시간표 불러오기 (GET)
export const fetchSchedule = async () => {
  const res = await axios.get(API_URL);
  return res.data.schedule;
};

// ✅ 새 시간표 추가 (POST)
export const addSchedule = async (scheduleData) => {
  const res = await axios.post(API_URL, scheduleData);
  return res.data;
};

// ✅ 시간표 삭제 (DELETE)
export const deleteSchedule = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};
