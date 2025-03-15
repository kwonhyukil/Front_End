// 📄 frontend/src/api/notice.js
// ✅ Axios를 활용한 공지사항 API 요청 관리
import axios from "axios";

// ✅ 환경변수에서 API 기본 URL 가져오기
const baseURL = import.meta.env.VITE_API_URL;

/**
 * ✅ 공지 목록 조회 (검색, 필터 적용 가능)
 * @param {Object} params - 검색 조건 (grade, keyword 등)
 * @returns {Promise<Array>} - 공지 목록 반환
 */
export const fetchNotices = async (params = {}) => {
  const res = await axios.get(`${baseURL}/notice`, { params });
  return res.data;
};

/**
 * ✅ 단일 공지 조회
 * @param {number} id - 공지사항 ID
 * @returns {Promise<Object>} - 공지 상세 정보 반환
 */
export const fetchNoticeById = async (id) => {
  const res = await axios.get(`${baseURL}/notice/${id}`);
  return res.data;
};

/**
 * ✅ 공지사항 작성 (파일 첨부 가능)
 * @param {string} token - JWT 인증 토큰
 * @param {FormData} formData - 제목, 내용, 대상 학년, 중요 여부, 첨부파일 포함
 * @returns {Promise<Object>} - 생성된 공지 반환
 */
export const createNotice = async (token, formData) => {
  const res = await axios.post(`${baseURL}/notice`, formData, {
    headers: {
      Authorization: `Bearer ${token}`, // ✅ JWT 인증
      "Content-Type": "multipart/form-data", // ✅ 파일 업로드 지원
    },
  });
  return res.data;
};

/**
 * ✅ 공지사항 수정
 * @param {string} token - JWT 인증 토큰
 * @param {number} id - 공지사항 ID
 * @param {Object} payload - 수정할 데이터 (title, content 등)
 * @returns {Promise<Object>} - 수정된 공지 반환
 */
export const updateNotice = async (token, id, payload) => {
  const res = await axios.put(`${baseURL}/notice/${id}`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

/**
 * ✅ 단일 공지 삭제
 * @param {string} token - JWT 인증 토큰
 * @param {number} id - 공지사항 ID
 * @returns {Promise<Object>} - 삭제 결과 반환
 */
export const deleteNotice = async (token, id) => {
  const res = await axios.delete(`${baseURL}/notice/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

/**
 * ✅ 다중 공지 삭제
 * @param {string} token - JWT 인증 토큰
 * @param {Array<number>} ids - 삭제할 공지 ID 배열
 * @returns {Promise<Object>} - 삭제 결과 반환
 */
export const deleteNoticesBulk = async (token, ids) => {
  const res = await axios.post(
    `${baseURL}/notice/bulk-delete`,
    { ids }, // ✅ { ids: [1, 2, 3] } 형태로 전송
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};
