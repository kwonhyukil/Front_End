import axios from "axios";
const baseURL = import.meta.env.VITE_API_URL;

/**
 * ✅ 가입 대기 사용자 목록 조회
 */
export const fetchPendingUsers = async (token) => {
  const res = await axios.get(`${baseURL}/admin/registrations`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

/**
 * ✅ 사용자 승인 요청
 */
export const approveUserRequest = async (token, userId) => {
  const res = await axios.post(
    `${baseURL}/admin/approve/${userId}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

/**
 * ✅ 사용자 거절 요청
 */
export const rejectUserRequest = async (token, userId) => {
  const res = await axios.delete(`${baseURL}/admin/reject/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
