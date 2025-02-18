import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/notices";

// 공지사항 목록 불러오기
export const fetchNotices = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("공지사항 불러오기 실패:", error);
    return [];
  }
};

// 공지사항 추가하기
export const addNotice = async (title, content) => {
  try {
    await axios.post(API_URL, { title, content });
  } catch (error) {
    console.error("공지사항 추가 실패:", error);
  }
};
