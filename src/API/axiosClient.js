import axios from 'axios';

// 1. Lấy baseURL từ biến môi trường (CRA chỉ chấp nhận biến prefix REACT_APP_)
const baseURL = process.env.REACT_APP_API_BASE_URL || 'const PORT = process.env.PORT || 4000;';

// 2. Log trước khi tạo instance (chỉ dùng biến baseURL, chưa đụng tới axiosClient)
console.log('[DEBUG] ENV REACT_APP_API_BASE_URL =', process.env.REACT_APP_API_BASE_URL);
console.log('[DEBUG] Using baseURL =', baseURL);

// 3. Tạo instance
const axiosClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000
});

// 4. Log sau khi đã tạo xong (bây giờ mới được phép truy cập axiosClient)
console.log('[DEBUG] axiosClient.defaults.baseURL =', axiosClient.defaults.baseURL);

// 5. Interceptor request: tự gắn token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// 6. Interceptor response: chuẩn hóa lỗi
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Có phản hồi từ server (>=400)
      return Promise.reject({
        type: 'response',
        status: error.response.status,
        data: error.response.data,
        message: error.response.data?.message || 'Request error'
      });
    } else if (error.request) {
      // Request đã gửi nhưng KHÔNG nhận bất kỳ response nào
      return Promise.reject({
        type: 'network',
        message: 'Không phản hồi từ máy chủ'
      });
    } else {
      // Lỗi cấu hình
      return Promise.reject({
        type: 'setup',
        message: error.message || 'Lỗi thiết lập request'
      });
    }
  }
);

export default axiosClient;