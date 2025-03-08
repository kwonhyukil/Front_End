import axios from "axios";
import store from "../store/auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

// ✅ 요청 인터셉터: 모든 요청에 Access Token 추가
api.interceptors.request.use(
  (config) => {
    const token = store.state.accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ 응답 인터셉터: Access Token이 만료되었을 때 자동 갱신
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await store.dispatch("refreshAccessToken");
        return api(originalRequest); // 🔄 토큰 갱신 후 원래 요청 재시도
      } catch (err) {
        store.commit("logout");
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
