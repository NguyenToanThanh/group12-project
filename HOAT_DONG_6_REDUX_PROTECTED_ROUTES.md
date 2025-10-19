# Hoạt động 6 - Frontend Redux & Protected Routes

## ✅ Đã hoàn thành

### 1. Cài đặt Redux Toolkit
- ✅ Đã cài đặt `@reduxjs/toolkit` và `react-redux`
- ✅ Tạo Redux store tại `src/redux/store.js`
- ✅ Tích hợp Provider trong `src/index.js`

### 2. Tạo Auth Slice
- ✅ File: `src/redux/authSlice.js`
- ✅ Chức năng:
  - State: user, accessToken, refreshToken, isAuthenticated, loading, error
  - Actions: login, logout, signup, refreshToken
  - Async Thunks: loginUser, signupUser, refreshAccessToken
  - JWT Decoder để lấy user info từ token

### 3. Protected Routes
- ✅ Cập nhật `src/components/ProtectedRoute.jsx` sử dụng Redux
- ✅ Hỗ trợ kiểm tra role: `<ProtectedRoute requiredRole="admin">`
- ✅ Tự động redirect về /login nếu chưa đăng nhập
- ✅ Redirect về trang chủ nếu không đủ quyền

### 4. Tích hợp Redux vào Components
- ✅ `Login.jsx` - sử dụng Redux dispatch
- ✅ `Signup.jsx` - sử dụng Redux dispatch
- ✅ `Home.jsx` - hiển thị Redux state
- ✅ `App.jsx` - Navigation với Redux state

### 5. Tạo trang mới
- ✅ `src/pages/profile/Profile.jsx` - Trang profile (protected)
- ✅ `src/pages/admin/AdminDashboard.jsx` - Trang admin (admin only)

### 6. Routes Configuration
```
Public Routes:
- / (Home)
- /login
- /signup
- /forgot-password
- /reset-password

Protected Routes (yêu cầu login):
- /profile
- /upload-avatar

Admin Routes (yêu cầu role=admin):
- /admin (Admin Dashboard)
- /admin/logs (Activity Logs)
```

## 📦 Cấu trúc Redux State

```javascript
{
  auth: {
    user: {
      email: "user@example.com",
      role: "admin|moderator|user",
      userId: "123"
    },
    accessToken: "jwt_token_here",
    refreshToken: "refresh_token_here",
    isAuthenticated: true,
    loading: false,
    error: null
  }
}
```

## 🧪 Hướng dẫn Test

### 1. Khởi động Backend
```bash
cd backend
npm install
node index.js
```

### 2. Khởi động Frontend
```bash
cd frontend
npm start
```

### 3. Test các chức năng

#### A. Test Public Access
1. Mở http://localhost:3000
2. Kiểm tra trang Home hiển thị "Vui lòng đăng nhập"
3. Click "Đăng nhập" hoặc "Đăng ký"

#### B. Test Signup & Login
1. Đăng ký tài khoản mới tại /signup
2. Đăng nhập với tài khoản vừa tạo
3. Kiểm tra redirect về /profile sau khi login thành công
4. Kiểm tra Navigation bar hiển thị email và role

#### C. Test Protected Routes
1. Sau khi login, truy cập:
   - /profile ✅ (phải thấy được)
   - /upload-avatar ✅ (phải thấy được)

2. Logout và thử truy cập:
   - /profile ❌ (redirect về /login)
   - /admin ❌ (redirect về /login)

#### D. Test Admin Routes
1. Login với tài khoản admin
2. Kiểm tra Navigation bar có links:
   - "Admin Dashboard"
   - "Activity Logs"
3. Truy cập /admin và /admin/logs
4. Logout và login lại với user thường
5. Thử truy cập /admin → sẽ redirect về trang chủ

#### E. Test Redux State
1. Mở Redux DevTools (cài extension nếu chưa có)
2. Login và kiểm tra state changes:
   - auth/login/pending
   - auth/login/fulfilled
3. Kiểm tra localStorage có accessToken và refreshToken
4. Logout và kiểm tra state reset về null

### 4. Test với Console

Mở Developer Console và chạy:

```javascript
// Kiểm tra Redux store
console.log('Redux State:', window.__REDUX_DEVTOOLS_EXTENSION__)

// Kiểm tra localStorage
console.log('Access Token:', localStorage.getItem('accessToken'))
console.log('Refresh Token:', localStorage.getItem('refreshToken'))

// Decode JWT
function decodeJWT(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

const token = localStorage.getItem('accessToken');
console.log('Decoded Token:', decodeJWT(token));
```

## 🎯 Các tính năng chính

### 1. Redux State Management
- ✅ Quản lý authentication state toàn cục
- ✅ Async thunks cho API calls
- ✅ Auto-save tokens vào localStorage
- ✅ Auto-load user từ token khi refresh trang

### 2. Protected Routes
- ✅ Route protection cho authenticated users
- ✅ Role-based access control
- ✅ Automatic redirects

### 3. Token Management
- ✅ Access token lưu trong Redux + localStorage
- ✅ Refresh token lưu trong localStorage
- ✅ JWT decoding để lấy user info

### 4. User Experience
- ✅ Loading states
- ✅ Error handling
- ✅ Automatic navigation sau login/logout
- ✅ Conditional rendering dựa trên auth state

## 📝 Git Workflow

```bash
# Checkout branch mới
git checkout -b feature/redux-protected

# Add files
git add .

# Commit
git commit -m "Thêm Redux và Protected Routes"

# Push
git push origin feature/redux-protected
```

## 🔗 Links Demo

- Trang chủ: http://localhost:3000
- Login: http://localhost:3000/login
- Signup: http://localhost:3000/signup
- Profile: http://localhost:3000/profile (protected)
- Admin: http://localhost:3000/admin (admin only)
- Activity Logs: http://localhost:3000/admin/logs (admin only)

## 🎉 Kết luận

Hoạt động 6 đã hoàn thành với đầy đủ các yêu cầu:
- ✅ Redux Toolkit setup
- ✅ Auth store với token management
- ✅ Protected Routes với role-based access
- ✅ Redux thunk gọi API
- ✅ Persistent state với localStorage
- ✅ Tích hợp hoàn chỉnh với backend

Backend hỗ trợ API và dữ liệu test sẵn để kiểm tra.
