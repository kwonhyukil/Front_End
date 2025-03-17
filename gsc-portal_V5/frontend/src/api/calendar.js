// [경로: frontend/src/api/calendar.js]
import axios from "axios";
const baseURL = import.meta.env.VITE_API_URL;

export const fetchCalendarEvents = async (token) => {
  const res = await axios.get(`${baseURL}/calendar`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const createCalendarEventRequest = async (token, payload) => {
  const res = await axios.post(`${baseURL}/calendar`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateCalendarEventRequest = async (token, id, payload) => {
  const res = await axios.put(`${baseURL}/calendar/${id}`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteCalendarEventRequest = async (token, id) => {
  const res = await axios.delete(`${baseURL}/calendar/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
