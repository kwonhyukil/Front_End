// 📁 src/api/timetable.js
import axios from "axios";
const baseURL = import.meta.env.VITE_API_URL;

export const fetchAllTimetables = async (grade = "all") => {
  const res = await axios.get(`${baseURL}/api/timetables`, {
    params: { grade },
  });
  return res.data;
};

export const createTimetableRequest = async (token, payload) => {
  const res = await axios.post(`${baseURL}/api/timetables`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
