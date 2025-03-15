import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ✅ 요청 주소 확인 ("/auth/google" → "/api/auth/google")
export const googleLogin = () => {
  window.location.href = `${API_URL}/api/auth/google`;
};

// ✅ 로그인 요청 (토큰 저장)
export const login = async (email) => {
  const response = await axios.post(`${API_URL}/api/auth/login`, { email });
  if (response.data.accessToken) {
    localStorage.setItem("accessToken", response.data.accessToken);
    localStorage.setItem("refreshToken", response.data.refreshToken);
    localStorage.setItem("user", JSON.stringify(response.data.user));
  }
  return response.data;
};

// ✅ 회원가입 요청
export const registerUser = async (userData) => {
  return await axios.post(`${API_URL}/auth/register`, userData);
};

// ✅ Access Token 갱신
export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return null;

  try {
    const response = await axios.post(`${API_URL}/auth/refresh`, {
      refreshToken,
    });
    localStorage.setItem("accessToken", response.data.accessToken);
    return response.data.accessToken;
  } catch (error) {
    console.error("❌ 토큰 갱신 실패:", error);
    return null;
  }
};

// ✅ 로그아웃 (토큰 삭제)
export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  window.location.href = "/login";
};
