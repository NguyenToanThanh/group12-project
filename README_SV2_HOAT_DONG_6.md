# 🎯 Hoạt động 6 - Frontend Redux & Protected Routes (SV2)

**Thành viên thực hiện:** Thành viên Frontend #2  
**Ngày hoàn thành:** October 18, 2025  
**Branch:** feature/redux-protected

---

## 📋 Tổng Quan

Hoạt động này thực hiện:
1. ✅ Cài đặt Redux Toolkit & React-Redux
2. ✅ Tạo Redux Store để quản lý authentication state
3. ✅ Tạo Protected Routes để bảo vệ các trang cần đăng nhập
4. ✅ Tích hợp Redux với API calls (login, signup, refresh token)
5. ✅ Thêm role-based access control (admin, moderator, user)

---

## 🚀 Quick Start

### 1. Cài đặt Dependencies

```bash
cd frontend
npm install
```

Dependencies đã được thêm:
- `@reduxjs/toolkit` - Redux state management
- `react-redux` - React bindings cho Redux

### 2. Khởi động Backend

```bash
cd backend
node index.js
```

Backend chạy tại: http://localhost:5000

### 3. Khởi động Frontend

```bash
cd frontend
npm start
```

Frontend chạy tại: http://localhost:3000

---

## 📁 Cấu Trúc File Mới

```
frontend/src/
├── redux/
│   ├── store.js           # Redux store configuration
│   └── authSlice.js       # Auth state & async thunks
├── components/
│   ├── ProtectedRoute.jsx # Route protection component
│   └── ReduxDebugger.jsx  # Debug tool (dev only)
├── pages/
│   ├── profile/
│   │   └── Profile.jsx    # User profile page (protected)
│   └── admin/
│       └── AdminDashboard.jsx  # Admin dashboard (admin only)
└── App.jsx                # Updated with Redux & protected routes
```

---

## 🔧 Chi Tiết Implementation

### 1. Redux Store (`src/redux/store.js`)

```javascript
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
```

**Chức năng:**
- Cấu hình Redux store
- Đăng ký auth reducer

---

### 2. Auth Slice (`src/redux/authSlice.js`)

**State Structure:**
```javascript
{
  user: {
    email: "user@example.com",
    role: "admin|moderator|user",
    userId: "123"
  },
  accessToken: "jwt_token",
  refreshToken: "refresh_token",
  isAuthenticated: true,
  loading: false,
  error: null
}
```

**Async Thunks:**
- `loginUser({ email, password })` - Đăng nhập
- `signupUser({ email, password })` - Đăng ký
- `refreshAccessToken()` - Làm mới token

**Reducers:**
- `logout()` - Đăng xuất
- `clearError()` - Xóa error
- `setCredentials({ accessToken, refreshToken, user })` - Set credentials

**Tính năng:**
- ✅ Auto-save tokens vào localStorage
- ✅ Auto-load user từ localStorage khi refresh page
- ✅ JWT decoding để lấy user info
- ✅ Error handling

---

### 3. Protected Route (`src/components/ProtectedRoute.jsx`)

```jsx
<ProtectedRoute>
  <Profile />
</ProtectedRoute>

// Với role check
<ProtectedRoute requiredRole="admin">
  <AdminDashboard />
</ProtectedRoute>
```

**Chức năng:**
- Kiểm tra `isAuthenticated` từ Redux state
- Redirect về `/login` nếu chưa đăng nhập
- Kiểm tra role nếu có `requiredRole`
- Redirect về `/` nếu không đủ quyền

---

### 4. Routes Configuration

#### Public Routes (không cần login)
```
/ - Trang chủ
/login - Đăng nhập
/signup - Đăng ký
/forgot-password - Quên mật khẩu
/reset-password - Đặt lại mật khẩu
```

#### Protected Routes (cần login)
```
/profile - Trang cá nhân
/upload-avatar - Upload ảnh đại diện
```

#### Admin Routes (cần role=admin)
```
/admin - Admin Dashboard
/admin/logs - Activity Logs
```

---

## 🧪 Testing Guide

### Test 1: Public Access
1. Mở http://localhost:3000
2. Thấy trang chủ với nút "Đăng nhập"
3. Thử truy cập /profile → redirect về /login ✅

### Test 2: Signup & Login Flow
1. Click "Đăng ký" hoặc vào /signup
2. Nhập thông tin và đăng ký
3. Login với tài khoản vừa tạo
4. Kiểm tra redirect về /profile
5. Navigation bar hiển thị email + role ✅

### Test 3: Protected Routes
**Khi đã login:**
- /profile → Thấy trang profile ✅
- /upload-avatar → Thấy trang upload ✅

**Khi chưa login:**
- /profile → Redirect về /login ✅
- /admin → Redirect về /login ✅

### Test 4: Role-Based Access

**Login với user thường:**
```
Email: user@example.com
Password: user123
```
- Truy cập /profile → OK ✅
- Truy cập /admin → Redirect về / ❌

**Login với admin:**
```
Email: admin@example.com
Password: admin123
```
- Truy cập /profile → OK ✅
- Truy cập /admin → OK ✅
- Thấy "Admin Dashboard" và "Activity Logs" ở nav ✅

### Test 5: Redux State

**Mở Redux DevTools:**
1. Cài extension: Redux DevTools
2. Mở DevTools → Tab Redux
3. Login và xem action flow:
   - `auth/login/pending`
   - `auth/login/fulfilled`
4. Kiểm tra state tree

**Hoặc dùng Redux Debugger:**
- Floating panel ở góc phải dưới màn hình (dev mode)
- Hiển thị real-time Redux state
- User info, tokens, authentication status

---

## 🎨 Redux Debugger Component

**Tính năng:**
- 📊 Hiển thị real-time Redux state
- ✅ Authentication status indicator
- 👤 User info (email, role, userId)
- 🔑 Token presence check
- 📦 Full state JSON viewer
- 💾 LocalStorage status

**Chỉ hiển thị trong development mode**

---

## 🔍 Debug Commands

### Kiểm tra LocalStorage
```javascript
// Access token
localStorage.getItem('accessToken')

// Refresh token
localStorage.getItem('refreshToken')

// Clear all
localStorage.clear()
```

### Decode JWT Token
```javascript
function decodeJWT(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(jsonPayload);
}

const token = localStorage.getItem('accessToken');
console.log(decodeJWT(token));
```

---

## 📝 Code Usage Examples

### 1. Sử dụng Redux trong Component

```jsx
import { useSelector, useDispatch } from 'react-redux';
import { loginUser, logout } from '../redux/authSlice';

function MyComponent() {
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      // Success
    } catch (error) {
      // Error handling
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };
}
```

### 2. Protected Route Usage

```jsx
// Basic protection
<Route path="/profile" element={
  <ProtectedRoute>
    <Profile />
  </ProtectedRoute>
} />

// With role check
<Route path="/admin" element={
  <ProtectedRoute requiredRole="admin">
    <AdminDashboard />
  </ProtectedRoute>
} />
```

---

## 🎯 Checklist Hoàn Thành

- [x] Cài đặt Redux Toolkit & React-Redux
- [x] Tạo Redux store
- [x] Tạo auth slice với async thunks
- [x] Tích hợp Provider vào index.js
- [x] Cập nhật ProtectedRoute sử dụng Redux
- [x] Thêm role-based access control
- [x] Cập nhật Login.jsx sử dụng Redux
- [x] Cập nhật Signup.jsx sử dụng Redux
- [x] Cập nhật Home.jsx hiển thị Redux state
- [x] Cập nhật App.jsx với protected routes
- [x] Tạo Profile page
- [x] Tạo AdminDashboard page
- [x] Tạo Redux Debugger component
- [x] Tạo file test HTML
- [x] Viết documentation

---

## 🐛 Troubleshooting

### Vấn đề: Redux state bị reset khi refresh page
**Giải pháp:** Redux đã được config để load từ localStorage. Kiểm tra localStorage có tokens không.

### Vấn đề: Protected route không hoạt động
**Giải pháp:** 
1. Kiểm tra Redux state có `isAuthenticated: true`
2. Kiểm tra localStorage có accessToken
3. Xem Redux DevTools để debug

### Vấn đề: Role-based access không hoạt động
**Giải pháp:**
1. Decode JWT token xem có field `role`
2. Kiểm tra backend trả về đúng role trong token
3. Kiểm tra ProtectedRoute có prop `requiredRole`

---

## 📚 Resources

- [Redux Toolkit Docs](https://redux-toolkit.js.org/)
- [React-Redux Hooks](https://react-redux.js.org/api/hooks)
- [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools)

---

## 🎉 Demo Files

1. **HOAT_DONG_6_REDUX_PROTECTED_ROUTES.md** - Hướng dẫn chi tiết
2. **test-redux-state.html** - Test page với UI đẹp
3. **ReduxDebugger.jsx** - Component debug trong app

---

## 📞 Support

Nếu gặp vấn đề:
1. Kiểm tra console log
2. Mở Redux DevTools
3. Kiểm tra Network tab (F12)
4. Xem file HOAT_DONG_6_REDUX_PROTECTED_ROUTES.md

---

**✅ Hoạt động 6 hoàn thành!**

State management nâng cao với Redux, Protected Routes, và Role-Based Access Control đã sẵn sàng sử dụng! 🚀
