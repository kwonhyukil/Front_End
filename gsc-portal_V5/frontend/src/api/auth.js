// [경로: frontend/src/api/auth.js]
import axios from "axios";
const baseURL = import.meta.env.VITE_API_URL;

export const logoutRequest = async (token) => {
  const res = await axios.get(`${baseURL}/auth/logout`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
