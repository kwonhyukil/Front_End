import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true
});

// Express 서버의 API 호출 예제
export const fetchHello = async () => {
  const response = await API.get("/api/hello");
  return response.data;
};
