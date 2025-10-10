import axios from "axios";

const API = axios.create({
baseURL: "http://localhost:3001/api",
 // thay bằng URL thật của backend
});

// Gửi kèm token (nếu có)
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;
