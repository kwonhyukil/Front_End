// 📄 frontend/src/api/auth.js
// ✅ Axios를 활용한 인증 관련 API 요청 관리
import axios from "axios";

// ✅ 환경변수에서 API 기본 URL 가져오기
const baseURL = import.meta.env.VITE_API_URL;

/**
 * ✅ 로그아웃 요청 함수
 * @param {string} token - 현재 로그인된 사용자의 JWT 토큰
 * @returns {Promise<Object>} - 서버에서 반환하는 로그아웃 응답 데이터
 */
export const logoutRequest = async (token) => {
  const res = await axios.get(`${baseURL}/auth/logout`, {
    headers: { Authorization: `Bearer ${token}` }, // ✅ JWT 토큰 포함 (인증 필요)
  });
  return res.data; // ✅ 서버 응답 데이터 반환
};
