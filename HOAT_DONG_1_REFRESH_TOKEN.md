# Hoạt động 1 - Refresh Token & Session Management

## 📋 Đã hoàn thành (SV2 - Frontend)

### 1. Cấu trúc File

#### Backend (`backend/auth.js`)
```javascript
- generateAccessToken()    // Tạo Access Token (15 phút)
- generateRefreshToken()   // Tạo Refresh Token (7 ngày)
- verifyAccessToken()      // Xác thực Access Token
- verifyRefreshToken()     // Xác thực Refresh Token
- revokeRefreshToken()     // Thu hồi khi logout
- authenticateToken()      // Middleware bảo vệ route
```

#### Backend Routes (`backend/index.js`)
```javascript
POST /api/signup          // Trả về { accessToken, refreshToken, user }
POST /api/login           // Trả về { accessToken, refreshToken, user }
POST /api/auth/refresh    // Nhận refreshToken → Trả accessToken mới
POST /api/logout          // Revoke refreshToken
```

#### Frontend (`frontend/src/api/axiosInstance.js`)
- ✅ Tự động gắn Authorization header cho mọi request
- ✅ Interceptor xử lý 401: Tự động gọi /auth/refresh
- ✅ Retry request với token mới
- ✅ Xử lý queue để tránh multiple refresh calls
- ✅ Redirect về /login khi refresh thất bại

### 2. Flow Hoạt Động

```
1. User đăng nhập → Backend trả { accessToken, refreshToken }
2. Frontend lưu vào localStorage
3. Mọi API call đều gắn: Authorization: Bearer <accessToken>
4. Khi Access Token hết hạn (15 phút):
   - API trả 401 Unauthorized
   - Interceptor tự động gọi POST /api/auth/refresh
   - Backend verify refreshToken → trả accessToken mới
   - Retry request cũ với token mới
   - ✅ User không bị logout!
5. Khi Refresh Token hết hạn (7 ngày):
   - /api/auth/refresh trả 403
   - Frontend xóa token và redirect về /login
```

### 3. Cách Test

#### Test 1: Đăng nhập thành công
```bash
1. Vào http://localhost:3000/login
2. Nhập email/password bất kỳ
3. Kiểm tra localStorage:
   - accessToken: JWT string
   - refreshToken: JWT string
```

#### Test 2: Token được gửi trong request
```bash
1. Đăng nhập
2. Mở DevTools → Network tab
3. Gọi API bất kỳ (vd: /api/profile)
4. Xem Headers → Authorization: Bearer <token>
```

#### Test 3: Auto refresh token
```bash
# Trong auth.js, đổi ACCESS_TOKEN_EXPIRY thành '10s'
const ACCESS_TOKEN_EXPIRY = '10s';

1. Đăng nhập
2. Đợi 10 giây
3. Gọi API → Console sẽ log "401 → Refreshing token"
4. Request tự động thành công với token mới!
```

#### Test 4: Logout revoke token
```bash
1. Đăng nhập
2. Copy refreshToken từ localStorage
3. Dùng Postman gọi:
   POST http://localhost:4000/api/auth/refresh
   Body: { "refreshToken": "..." }
   → Trả accessToken mới ✅

4. Logout (sẽ revoke token)
5. Gọi lại Postman với refreshToken cũ
   → Trả 403 Forbidden ❌
```

### 4. Demo cho Giáo Viên

#### Chuẩn bị
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

#### Demo Script
```
1. Mở http://localhost:3000/signup
   → Đăng ký tài khoản mới
   → Alert "Đăng ký thành công"
   → Chuyển sang /login

2. Đăng nhập
   → Alert "Đăng nhập thành công"
   → Kiểm tra localStorage có 2 token

3. Mở Console → Application → Local Storage
   → Hiển thị accessToken và refreshToken

4. Vào /profile hoặc gọi API
   → Network tab: Request có Authorization header
   → Backend log: "Bearer <token>"

5. (Optional) Demo auto-refresh:
   → Đổi ACCESS_TOKEN_EXPIRY = '5s' trong auth.js
   → Khởi động lại backend
   → Đăng nhập, đợi 5s, refresh trang
   → Console log quá trình refresh token tự động
```

### 5. Postman Collection

#### 1. Signup
```http
POST http://localhost:4000/api/signup
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "123456"
}
```

#### 2. Login
```http
POST http://localhost:4000/api/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "123456"
}
```

#### 3. Refresh Token
```http
POST http://localhost:4000/api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "<PASTE_REFRESH_TOKEN_HERE>"
}
```

#### 4. Protected Route (ví dụ)
```http
GET http://localhost:4000/api/profile
Authorization: Bearer <ACCESS_TOKEN>
```

#### 5. Logout
```http
POST http://localhost:4000/api/logout
Content-Type: application/json

{
  "refreshToken": "<PASTE_REFRESH_TOKEN_HERE>"
}
```

### 6. Link PR GitHub

```bash
# Tạo branch mới
git checkout -b feature/refresh-token

# Add files
git add .
git commit -m "Thêm tính năng Refresh Token & Session Management"

# Push
git push origin feature/refresh-token

# Tạo Pull Request trên GitHub với nội dung:
# Title: [Hoạt động 1] Refresh Token & Session Management
# Description: 
# - Thêm JWT authentication với Access Token (15 phút) và Refresh Token (7 ngày)
# - API /auth/refresh để cấp token mới
# - Frontend tự động refresh khi token hết hạn
# - Revoke token khi logout
# - Test Postman: [link collection]
# - Demo: [link video hoặc screenshots]
```

### 7. Lưu Ý Quan Trọng

⚠️ **Security Best Practices** (cho production):
- Lưu Refresh Token trong HTTP-only cookie (không phải localStorage)
- Sử dụng environment variables cho SECRET_KEYS
- Lưu Refresh Token vào database (Redis hoặc MongoDB)
- Thêm CSRF protection
- Rate limiting cho endpoint /auth/refresh

✅ **Đã implement** (phù hợp với bài học):
- JWT với expiry time
- Refresh token flow
- Auto-refresh khi 401
- Revoke token khi logout
- localStorage để demo dễ dàng
