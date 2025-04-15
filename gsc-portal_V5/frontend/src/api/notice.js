// [경로: frontend/src/api/notice.js]
import axios from "axios";
const baseURL = import.meta.env.VITE_API_URL;

// 목록
export const fetchNotices = async (params = {}) => {
  const res = await axios.get(`${baseURL}/api/notice`, { params });
  return res.data;
};

// 단일조회
export const fetchNoticeById = async (id) => {
  const res = await axios.get(`${baseURL}/api/notice/${id}`);
  return res.data; // { notice, attachments }
};

// 작성 (FormData)
export const createNotice = async (token, formData) => {
  const res = await axios.post(`${baseURL}/api/notice`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// 수정
export const updateNotice = async (token, id, payload) => {
  const res = await axios.put(`${baseURL}/api/notice/${id}`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// 단일 삭제
export const deleteNotice = async (token, id) => {
  const res = await axios.delete(`${baseURL}/api/notice/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// 다중 삭제
export const deleteNoticesBulk = async (token, ids) => {
  const res = await axios.post(
    `${baseURL}/api/notice/bulk-delete`,
    { ids },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

// 첨부파일 다운로드
export const downloadAttachmentRequest = async (token, attachmentId) => {
  const res = await axios.get(
    `${baseURL}/api/notice/download/${attachmentId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
    }
  );
  return res;
};
