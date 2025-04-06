// [경로: frontend/src/api/auth.js]
import axios from "axios";

const baseURL = "http://localhost:8080";

// 로그아웃
export const logout = async () => {
  try {
    const response = await axios.get(`${baseURL}/auth/logout`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("로그아웃 오류:", error);
    throw new Error("로그아웃 처리 중 오류가 발생했습니다.");
  }
};
