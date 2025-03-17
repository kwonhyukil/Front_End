// [경로: frontend/src/api/user.js]
import axios from "axios";
const baseURL = import.meta.env.VITE_API_URL;

// 사용자 프로필
export const fetchUserProfile = async (token) => {
  const res = await axios.get(`${baseURL}/user/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// 임시 회원가입 정보 등록
export const saveRegistrationRequest = async (payload) => {
  // { email, name, phone, student_id, role_id, is_international }
  const res = await axios.post(`${baseURL}/user/registration`, payload);
  return res.data;
};

// 관리자 전용
export const fetchRegistrations = async (token) => {
  const res = await axios.get(`${baseURL}/user/registrations`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
export const approveRegistrationRequest = async (token, regId) => {
  const res = await axios.put(
    `${baseURL}/user/registration/approve/${regId}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};
export const rejectRegistrationRequest = async (token, regId) => {
  const res = await axios.put(
    `${baseURL}/user/registration/reject/${regId}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};
