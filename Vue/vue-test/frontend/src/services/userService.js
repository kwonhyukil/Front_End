import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/users";

// 모든 사용자 조회
export const fetchUsers = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("사용자 목록 불러오기 실패:", error);
    return [];
  }
};

// 사용자 추가
export const addUser = async (name, email) => {
  try {
    await axios.post(API_URL, { name, email });
  } catch (error) {
    console.error("사용자 추가 실패:", error);
  }
};
