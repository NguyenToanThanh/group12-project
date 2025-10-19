# 🎯 HOẠT ĐỘNG 7 - TỔNG HỢP & MERGE VÀO MAIN
## Frontend Member #2 - Complete Integration Plan

---

## 📋 MỤC TIÊU

✅ Tích hợp toàn bộ tính năng cao vào repo chính  
✅ Test flow đầy đủ  
✅ Merge tất cả nhánh feature vào main  
✅ Cập nhật README.md hướng dẫn chạy ứng dụng  

---

## 🌳 CÁC NHÁNH CẦN MERGE

Theo yêu cầu bài tập:

1. **feature/rbac** - Hoạt động 2: Role-Based Access Control
2. **feature/avatar-upload** - Hoạt động 3: Upload Avatar
3. **feature/forgot-password** - Hoạt động 4: Forgot/Reset Password
4. **feature/log-rate-limit** - Hoạt động 5: Activity Logging & Rate Limiting
5. **feature/refresh-token** - Hoạt động 1: Refresh Token (đang làm)

---

## 📊 TRẠNG THÁI HIỆN TẠI

### Nhánh hiện tại: `feature/refresh-token`

**Conflicts:**
- ❌ `frontend/.env` - deleted by us
- ❌ `frontend/src/.env` - deleted by us
- ❌ `frontend/src/App.js` - both modified
- ❌ `frontend/src/App.jsx` - deleted by us

**Modified files:**
- frontend/package.json
- frontend/src/App.css
- frontend/src/index.js

**Untracked files (Documentation):**
- Nhiều file .md hướng dẫn
- Backend folder
- Test files

---

## 🚀 KẾ HOẠCH THỰC HIỆN (7 BƯỚC)

### BƯỚC 1: GIẢI QUYẾT CONFLICTS Ở NHÁNH HIỆN TẠI
```bash
# Đang ở: feature/refresh-token
git status

# Resolve conflicts:
# - Xóa .env files (không cần thiết)
# - Chọn phiên bản App.js phù hợp
# - Xóa App.jsx nếu đã có App.js

git add .
git commit -m "Resolve merge conflicts in feature/refresh-token"
```

### BƯỚC 2: TẠO CÁC NHÁNH FEATURE MỚI
```bash
# Tạo nhánh feature/rbac từ main
git checkout main
git pull origin main
git checkout -b feature/rbac

# Tạo nhánh feature/avatar-upload từ main
git checkout main
git checkout -b feature/avatar-upload

# Tạo nhánh feature/forgot-password từ main
git checkout main
git checkout -b feature/forgot-password

# Tạo nhánh feature/log-rate-limit từ main
git checkout main
git checkout -b feature/log-rate-limit
```

### BƯỚC 3: COMMIT CODE CHO TỪNG NHÁNH

#### 3.1. NHÁNH feature/rbac (Hoạt động 2)
```bash
git checkout feature/rbac

# Add code:
# - frontend/src/components/RoleGate.jsx
# - frontend/src/components/ProtectedRoute.jsx
# - Update App.jsx with role-based routes
# - Add documentation

git add .
git commit -m "feat: Add RBAC - Role-Based Access Control

- Add RoleGate component for role checking
- Add ProtectedRoute component for authentication
- Implement role-based navigation
- Add admin/user/moderator roles support

Closes Hoạt động 2"

git push origin feature/rbac
```

#### 3.2. NHÁNH feature/avatar-upload (Hoạt động 3)
```bash
git checkout feature/avatar-upload

# Add code:
# - frontend/src/pages/profile/UploadAvatar.jsx
# - Backend multer configuration
# - Upload API endpoint
# - Static files serving

git add .
git commit -m "feat: Add Avatar Upload feature

- Add UploadAvatar component with preview
- Implement multer middleware for file upload
- Add /api/upload-avatar endpoint
- Serve uploaded files via /uploads route
- Add file validation (type, size)

Closes Hoạt động 3"

git push origin feature/avatar-upload
```

#### 3.3. NHÁNH feature/forgot-password (Hoạt động 4)
```bash
git checkout feature/forgot-password

# Add code:
# - frontend/src/pages/Auth/ForgotPassword.jsx
# - frontend/src/pages/Auth/ResetPassword.jsx
# - Backend forgot/reset password APIs
# - Token generation & validation

git add .
git commit -m "feat: Add Forgot/Reset Password feature

- Add ForgotPassword page with email input
- Add ResetPassword page with token validation
- Implement /api/forgot-password endpoint
- Implement /api/reset-password endpoint
- Add password reset token system

Closes Hoạt động 4"

git push origin feature/forgot-password
```

#### 3.4. NHÁNH feature/log-rate-limit (Hoạt động 5)
```bash
git checkout feature/log-rate-limit

# Add code:
# - frontend/src/pages/admin/ActivityLogs.jsx
# - Backend activity logging system
# - Backend rate limiting middleware
# - Activity logs API endpoint

git add .
git commit -m "feat: Add Activity Logging & Rate Limiting

- Add ActivityLogs admin page
- Implement activity logging system
- Add rate limiting for login attempts
- Add /api/activity-logs endpoint
- Track user actions (login, upload, etc.)

Closes Hoạt động 5"

git push origin feature/log-rate-limit
```

### BƯỚC 4: MERGE TẤT CẢ VÀO MAIN

```bash
# Checkout main
git checkout main
git pull origin main

# Merge feature/rbac
git merge feature/rbac --no-ff -m "Merge feature/rbac - RBAC implementation"
git push origin main

# Merge feature/avatar-upload
git merge feature/avatar-upload --no-ff -m "Merge feature/avatar-upload - Avatar upload feature"
git push origin main

# Merge feature/forgot-password
git merge feature/forgot-password --no-ff -m "Merge feature/forgot-password - Password reset feature"
git push origin main

# Merge feature/log-rate-limit
git merge feature/log-rate-limit --no-ff -m "Merge feature/log-rate-limit - Logging & rate limiting"
git push origin main

# Merge feature/refresh-token
git merge feature/refresh-token --no-ff -m "Merge feature/refresh-token - JWT refresh token"
git push origin main
```

### BƯỚC 5: TEST TOÀN BỘ FLOW

```bash
# Start backend
cd backend
node index.js

# Start frontend (terminal mới)
cd frontend
npm start
```

**Test scenarios:**
1. ✅ Đăng ký tài khoản mới
2. ✅ Đăng nhập
3. ✅ Refresh token tự động
4. ✅ Upload avatar
5. ✅ Reset password
6. ✅ Xem activity logs (admin)
7. ✅ RBAC - User không vào được admin
8. ✅ RBAC - Admin vào được mọi route
9. ✅ Rate limiting - Block sau 5 lần login sai
10. ✅ Page refresh - vẫn còn đăng nhập

### BƯỚC 6: CẬP NHẬT README.md

```bash
git checkout main

# Create/Update README.md with:
# - Project description
# - Features list
# - Installation guide
# - Usage guide
# - API endpoints
# - Screenshots

git add README.md
git commit -m "docs: Update README with complete guide"
git push origin main
```

### BƯỚC 7: NỘP BÀI

**Sản phẩm nộp:**
1. ✅ Repo GitHub hoàn chỉnh
2. ✅ Video demo đầy đủ chức năng (15-20 phút)
3. ✅ Ảnh chụp Postman testing
4. ✅ Screenshots frontend
5. ✅ README.md chi tiết

---

## 📝 CHECKLIST HOÀN THÀNH

### Git & GitHub:
- [ ] Resolve conflicts ở feature/refresh-token
- [ ] Tạo nhánh feature/rbac
- [ ] Tạo nhánh feature/avatar-upload
- [ ] Tạo nhánh feature/forgot-password
- [ ] Tạo nhánh feature/log-rate-limit
- [ ] Commit code cho feature/rbac
- [ ] Commit code cho feature/avatar-upload
- [ ] Commit code cho feature/forgot-password
- [ ] Commit code cho feature/log-rate-limit
- [ ] Push tất cả nhánh lên GitHub
- [ ] Merge feature/rbac → main
- [ ] Merge feature/avatar-upload → main
- [ ] Merge feature/forgot-password → main
- [ ] Merge feature/log-rate-limit → main
- [ ] Merge feature/refresh-token → main
- [ ] Tag release version

### Testing:
- [ ] Test đăng ký
- [ ] Test đăng nhập
- [ ] Test refresh token
- [ ] Test upload avatar
- [ ] Test forgot password
- [ ] Test reset password
- [ ] Test activity logs
- [ ] Test rate limiting
- [ ] Test RBAC user
- [ ] Test RBAC admin
- [ ] Test page refresh persistence

### Documentation:
- [ ] README.md hoàn chỉnh
- [ ] API documentation
- [ ] Setup guide
- [ ] User guide
- [ ] Screenshots
- [ ] Video demo

---

## 🎬 VIDEO DEMO YÊU CẦU

**Nội dung (15-20 phút):**

1. **Giới thiệu (2 phút)**
   - Tổng quan project
   - Các tính năng chính
   - Tech stack

2. **Demo Hoạt động 1 - Refresh Token (2 phút)**
   - Show JWT token
   - Token expire
   - Auto refresh

3. **Demo Hoạt động 2 - RBAC (3 phút)**
   - Login user → Không vào admin
   - Login admin → Vào được admin
   - Show RoleGate, ProtectedRoute code

4. **Demo Hoạt động 3 - Upload Avatar (2 phút)**
   - Upload ảnh
   - Preview
   - Avatar hiển thị

5. **Demo Hoạt động 4 - Forgot/Reset Password (3 phút)**
   - Forgot password flow
   - Reset token
   - Set new password
   - Login với password mới

6. **Demo Hoạt động 5 - Logging & Rate Limit (3 phút)**
   - Show activity logs
   - Login sai 5 lần → Block
   - Wait → Thử lại được

7. **Tổng hợp (2 phút)**
   - Flow hoàn chỉnh
   - GitHub branches
   - README.md

8. **Kết luận (1 phút)**
   - Challenges
   - Lessons learned
   - Future improvements

---

## 📸 SCREENSHOTS CẦN CHỤP

1. GitHub Branches view
2. Postman - Login API
3. Postman - Refresh Token API
4. Postman - Upload Avatar API
5. Frontend - Login page
6. Frontend - Signup page
7. Frontend - Profile page
8. Frontend - Upload Avatar page
9. Frontend - Forgot Password page
10. Frontend - Reset Password page
11. Frontend - Activity Logs (admin)
12. Redux DevTools - Auth state
13. Network Tab - API calls
14. Terminal - Backend running
15. Terminal - Frontend running

---

## 🛠️ TOOLS CẦN THIẾT

- ✅ Git & GitHub
- ✅ VS Code
- ✅ Node.js & npm
- ✅ Postman (API testing)
- ✅ OBS/Loom (screen recording)
- ✅ Redux DevTools Extension
- ✅ React Developer Tools

---

## 🎯 TIÊU CHÍ ĐÁNH GIÁ

1. **Code Quality (30%)**
   - Clean code
   - Proper structure
   - Comments
   - Error handling

2. **Functionality (40%)**
   - All features working
   - No critical bugs
   - Smooth UX

3. **Git Workflow (15%)**
   - Proper branching
   - Good commit messages
   - Clean merge history

4. **Documentation (15%)**
   - Clear README
   - API docs
   - Setup guide
   - Demo video

---

## ⏱️ TIMELINE DỰ KIẾN

| Task | Time |
|------|------|
| Resolve conflicts | 30 min |
| Create branches | 15 min |
| Organize code by feature | 2 hours |
| Commit & push branches | 1 hour |
| Merge to main | 30 min |
| Testing full flow | 1 hour |
| Update README | 1 hour |
| Record demo video | 1 hour |
| Review & submit | 30 min |
| **TOTAL** | **~8 hours** |

---

## 🚨 LƯU Ý QUAN TRỌNG

### Trước khi merge:
1. ✅ Test kỹ từng feature
2. ✅ Resolve tất cả conflicts
3. ✅ Update documentation
4. ✅ Review code

### Khi merge:
1. ✅ Dùng `--no-ff` để giữ lịch sử
2. ✅ Write clear merge messages
3. ✅ Test sau mỗi merge

### Sau khi merge:
1. ✅ Test toàn bộ flow
2. ✅ Fix bugs nếu có
3. ✅ Tag version
4. ✅ Update README

---

**Bắt đầu từ BƯỚC 1 ngay!** 🚀
