// 📄 frontend/src/api/user.js
/*
  ✅ 사용자 정보 API 요청 처리 모듈
*/
import axios from "axios";

// ✅ 환경변수에서 API 기본 URL 가져오기
const baseURL = import.meta.env.VITE_API_URL;

/**
 * ✅ 사용자 프로필 조회
 * @param {string} token - JWT 인증 토큰
 * @returns {Promise<Object>} - 사용자 정보 (id, name, email, phone, role_id)
 */
export const fetchUserProfile = async (token) => {
  const res = await axios.get(`${baseURL}/user/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
