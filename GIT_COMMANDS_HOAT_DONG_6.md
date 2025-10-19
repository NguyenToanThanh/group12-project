# Git Commands for Hoạt Động 6

## Kiểm tra branch hiện tại
```bash
git branch
```

## Tạo và checkout branch mới (nếu chưa có)
```bash
git checkout -b feature/redux-protected
```

## Hoặc checkout branch đã có
```bash
git checkout feature/redux-protected
```

## Add tất cả files mới
```bash
git add .
```

## Commit với message
```bash
git commit -m "Thêm Redux và Protected Routes

Hoạt động 6 - Frontend Redux & Protected Routes
Thành viên: SV2 Frontend

Các thay đổi:
- Cài đặt Redux Toolkit và React-Redux
- Tạo Redux store và auth slice
- Implement async thunks: login, signup, refreshToken
- Tạo Protected Routes với role-based access
- Cập nhật Login, Signup, Home, App components
- Tạo Profile và AdminDashboard pages
- Thêm Redux Debugger component
- Tạo test page và documentation

Features:
✅ Redux state management
✅ Protected routes (/profile, /admin)
✅ Role-based access control
✅ Token management với localStorage
✅ JWT decoding
✅ Persistent authentication
✅ Error handling và loading states

Files changed:
- frontend/package.json
- frontend/src/redux/store.js (new)
- frontend/src/redux/authSlice.js (new)
- frontend/src/components/ProtectedRoute.jsx
- frontend/src/components/ReduxDebugger.jsx (new)
- frontend/src/pages/profile/Profile.jsx (new)
- frontend/src/pages/admin/AdminDashboard.jsx (new)
- frontend/src/index.js
- frontend/src/App.jsx
- frontend/src/pages/Login.jsx
- frontend/src/pages/Signup.jsx
- frontend/src/pages/Home.jsx
- Documentation files (3 new)
- Test files (2 new)
"
```

## Push lên GitHub
```bash
git push origin feature/redux-protected
```

## Nếu branch chưa có trên remote
```bash
git push -u origin feature/redux-protected
```

## Kiểm tra status
```bash
git status
```

## Xem log
```bash
git log --oneline -5
```

## Tạo Pull Request (sau khi push)
1. Mở GitHub repository
2. Vào tab "Pull requests"
3. Click "New pull request"
4. Chọn base: main/master, compare: feature/redux-protected
5. Điền title: "Hoạt Động 6 - Redux & Protected Routes"
6. Điền description:
```
## Hoạt động 6 - Frontend Redux & Protected Routes

### Thành viên thực hiện
SV2 - Frontend Developer #2

### Tóm tắt
Implement Redux Toolkit để quản lý authentication state và Protected Routes để bảo vệ các trang cần đăng nhập.

### Tính năng chính
- ✅ Redux store với auth slice
- ✅ Async thunks cho login/signup/refresh
- ✅ Protected Routes với role-based access
- ✅ Token management
- ✅ Persistent authentication
- ✅ Redux Debugger tool

### Testing
- ✅ Login/Signup flow
- ✅ Protected routes redirect
- ✅ Role-based access control
- ✅ Token persistence
- ✅ State management

### Documentation
- README_SV2_HOAT_DONG_6.md
- HOAT_DONG_6_REDUX_PROTECTED_ROUTES.md
- BAO_CAO_HOAT_DONG_6.md
- test-redux-state.html

### Demo
Xem hướng dẫn test tại: README_SV2_HOAT_DONG_6.md
```

7. Click "Create pull request"

## Merge vào main (sau khi review)
```bash
git checkout main
git pull origin main
git merge feature/redux-protected
git push origin main
```
