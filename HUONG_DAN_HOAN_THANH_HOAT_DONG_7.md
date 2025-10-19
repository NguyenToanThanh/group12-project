# 🚀 HƯỚNG DẪN THỰC HIỆN HOẠT ĐỘNG 7 - ĐƠN GIẢN HÓA
## Tổng hợp & Đưa lên GitHub - Frontend Member #2

---

## 📊 TÌNH TRẠNG HIỆN TẠI

Bạn đang có:
- ✅ Tất cả code hoạt động 1-6 đã hoàn thành
- ✅ Nhiều file documentation
- ❌ Đang ở nhánh `feature/refresh-token` với conflicts
- ❌ Backend folder chưa được commit

---

## 🎯 CHIẾN LƯỢC ĐƠN GIẢN

**Thay vì tạo nhiều nhánh riêng lẻ**, chúng ta sẽ:
1. Hủy merge hiện tại
2. Tổng hợp TẤT CẢ code vào nhánh `feature/refresh-token`
3. Tạo 1 nhánh tổng hợp `feature/complete-integration`  
4. Push lên GitHub
5. Merge vào main

**Lý do:** Code của bạn đã hoàn thiện tất cả 6 hoạt động, chỉ cần organize và đưa lên GitHub.

---

## 📝 CÁC BƯỚC THỰC HIỆN

### BƯỚC 1: HỦY MERGE VÀ RESET
```powershell
# Hủy merge hiện tại
git merge --abort

# Về trạng thái sạch
git reset --hard HEAD
```

### BƯỚC 2: COMMIT TẤT CẢ CODE FRONTEND VÀ BACKEND
```powershell
# Xóa file lỗi
Remove-Item "frontend\NUL" -Force -ErrorAction SilentlyContinue

# Add tất cả file (trừ node_modules trong .gitignore)
git add .

# Commit với message rõ ràng
git commit -m "feat: Complete frontend activities 1-6

- Activity 1: Refresh Token implementation
- Activity 2: RBAC - Role-Based Access Control
- Activity 3: Avatar Upload feature
- Activity 4: Forgot/Reset Password flow
- Activity 5: Activity Logging & Rate Limiting
- Activity 6: Redux & Protected Routes
- Add comprehensive documentation
- Add backend with all API endpoints
- Fix port configurations and bugs"
```

### BƯỚC 3: PUSH NHÁNH LÊN GITHUB
```powershell
# Push nhánh feature/refresh-token
git push origin feature/refresh-token -f
```

### BƯỚC 4: TẠO PULL REQUEST TRÊN GITHUB

1. Vào GitHub: https://github.com/NguyenToanThanh/group12-project
2. Click tab "Pull requests"
3. Click "New pull request"
4. Base: `main` ← Compare: `feature/refresh-token`
5. Title: "Tổng hợp Hoạt động 1-6 - Frontend Member #2"
6. Description:
```markdown
## 📋 Tổng hợp các hoạt động

### ✅ Hoạt động 1: Refresh Token
- JWT access token & refresh token
- Auto refresh khi token hết hạn
- Token storage in localStorage

### ✅ Hoạt động 2: RBAC
- Role-based access control
- ProtectedRoute component  
- RoleGate for admin/user/moderator
- Conditional navigation

### ✅ Hoạt động 3: Upload Avatar
- Multer file upload
- Image preview
- File validation (type, size)
- Static file serving

### ✅ Hoạt động 4: Forgot/Reset Password
- Email-based password reset
- Token generation
- Secure password update

### ✅ Hoạt động 5: Activity Logging & Rate Limiting
- Track user activities
- Admin dashboard for logs
- Login rate limiting (5 attempts/15min)
- Activity filtering

### ✅ Hoạt động 6: Redux & Protected Routes
- Redux Toolkit integration
- Centralized state management
- Protected routes with auth check
- Redux DevTools debugger

## 🛠️ Technical Stack
- **Frontend**: React, Redux Toolkit, React Router v6, Axios
- **Backend**: Express.js, JWT, Multer, CORS
- **Auth**: JWT access + refresh tokens
- **State**: Redux with persistence

## 🎯 Files Modified/Added
- Frontend: Complete React app with Redux
- Backend: Full REST API
- Documentation: 20+ MD files
- Testing: Test pages and scripts

## ✅ Testing
- All features tested
- No critical bugs
- Port configurations fixed
- API endpoints working

## 📸 Screenshots
[Add screenshots here]
```

7. Click "Create pull request"

### BƯỚC 5: (OPTIONAL) MERGE VÀO MAIN

**Nếu bạn có quyền merge:**
```powershell
# Checkout main
git checkout main
git pull origin main

# Merge feature branch
git merge feature/refresh-token --no-ff -m "Merge feature/refresh-token - Complete integration"

# Push main
git push origin main
```

**Nếu không, đợi reviewer approve và merge PR trên GitHub**

---

## 📄 BƯỚC 6: TẠO README.md HOÀN CHỈNH

Tạo file `README.md` ở root project:

```markdown
# 🎓 Group 12 - User Management System
## Advanced Web Development Project

---

## 👥 Team Members
- **Member 1**: [Tên] - Backend Developer
- **Member 2**: [Tên bạn] - Frontend Developer
- **Member 3**: [Tên] - Fullstack Developer

---

## 📋 Project Overview
A complete user management system with advanced features:
- User authentication & authorization
- Role-based access control (RBAC)
- File upload (Avatar)
- Password reset flow
- Activity logging & rate limiting
- Real-time state management with Redux

---

## 🚀 Features

### 1. Authentication (Activity 1)
- ✅ JWT-based authentication
- ✅ Access token & Refresh token
- ✅ Auto token refresh
- ✅ Persistent login (localStorage)

### 2. RBAC - Role-Based Access Control (Activity 2)
- ✅ 3 roles: Admin, Moderator, User
- ✅ Protected routes by role
- ✅ Conditional UI rendering
- ✅ Role-specific navigation

### 3. Avatar Upload (Activity 3)
- ✅ Multer file upload
- ✅ Image preview before upload
- ✅ File type validation
- ✅ File size limit (5MB)
- ✅ Static file serving

### 4. Forgot/Reset Password (Activity 4)
- ✅ Email-based reset request
- ✅ Secure reset token
- ✅ Password update flow
- ✅ Token expiration

### 5. Activity Logging & Rate Limiting (Activity 5)
- ✅ Log all user actions
- ✅ Admin dashboard for logs
- ✅ Filter by user/action
- ✅ Login rate limiting (5 attempts/15min)
- ✅ Auto-unlock after timeout

### 6. Redux & Protected Routes (Activity 6)
- ✅ Redux Toolkit state management
- ✅ Async thunks for API calls
- ✅ Protected route component
- ✅ Redux DevTools integration
- ✅ Redux Debugger UI

---

## 🛠️ Tech Stack

### Frontend
- React 18+
- Redux Toolkit
- React Router v6
- Axios
- CSS3

### Backend
- Node.js
- Express.js
- JWT (jsonwebtoken)
- Multer
- CORS

### Database
- In-memory (for demo)
- Can be replaced with MongoDB/PostgreSQL

---

## 📦 Installation

### Prerequisites
- Node.js 16+ và npm
- Git

### 1. Clone Repository
\`\`\`bash
git clone https://github.com/NguyenToanThanh/group12-project.git
cd group12-project
\`\`\`

### 2. Install Backend
\`\`\`bash
cd backend
npm install
\`\`\`

### 3. Install Frontend
\`\`\`bash
cd ../frontend
npm install
\`\`\`

---

## 🚀 Usage

### Start Backend
\`\`\`bash
cd backend
node index.js
# Backend running on http://localhost:5000
\`\`\`

### Start Frontend (Terminal mới)
\`\`\`bash
cd frontend
npm start
# Frontend running on http://localhost:3000
\`\`\`

### Quick Start (Windows)
\`\`\`bash
# Chạy file START_ALL.bat
START_ALL.bat
\`\`\`

---

## 🧪 Testing

### Demo Accounts
\`\`\`
Admin:
  Email: admin@example.com
  Password: 123456

User:
  Email: user@example.com
  Password: 123456

Moderator:
  Email: mod@example.com
  Password: 123456
\`\`\`

### Test Scenarios
1. **Signup & Login**
   - Signup new account
   - Login with credentials
   - Check Redux state

2. **RBAC**
   - Login as user → Cannot access /admin
   - Login as admin → Can access all routes

3. **Upload Avatar**
   - Navigate to /upload-avatar
   - Select image file
   - Upload and verify URL

4. **Forgot Password**
   - Go to /forgot-password
   - Enter email
   - Get reset token
   - Reset password at /reset-password

5. **Activity Logs** (Admin only)
   - Login as admin
   - Go to /admin/logs
   - View all activities
   - Filter by user/action

6. **Rate Limiting**
   - Try login with wrong password 5 times
   - Should be blocked
   - Wait 15 minutes or check console

---

## 📁 Project Structure

\`\`\`
group12-project/
├── backend/
│   ├── auth.js              # JWT utilities
│   ├── index.js             # Express server
│   ├── uploads/             # Uploaded files
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/             # Axios config
│   │   ├── components/      # Reusable components
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── RoleGate.jsx
│   │   ├── pages/           # Page components
│   │   │   ├── Auth/        # Login, Signup, Forgot, Reset
│   │   │   ├── admin/       # ActivityLogs
│   │   │   └── profile/     # UploadAvatar
│   │   ├── redux/           # Redux store & slices
│   │   │   ├── store.js
│   │   │   └── authSlice.js
│   │   ├── App.jsx          # Main app
│   │   └── index.js         # Entry point
│   └── package.json
├── HOAT_DONG_*.md           # Activity docs
├── README.md                # This file
└── START_ALL.bat            # Quick start script
\`\`\`

---

## 🌐 API Endpoints

### Authentication
- `POST /api/signup` - Create new account
- `POST /api/login` - Login
- `POST /api/logout` - Logout
- `POST /api/auth/refresh` - Refresh access token

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile

### Password Reset
- `POST /api/forgot-password` - Request password reset
- `POST /api/reset-password` - Reset password with token

### Avatar
- `POST /api/upload-avatar` - Upload avatar image
- `GET /uploads/:filename` - Get uploaded file

### Users (Admin)
- `GET /api/users` - List all users
- `DELETE /api/users/:id` - Delete user

### Activity Logs (Admin)
- `GET /api/activity-logs` - Get activity logs
- Query params: `?limit=50&userId=...&action=...`

---

## 📸 Screenshots

### Login Page
[Screenshot here]

### Dashboard
[Screenshot here]

### Upload Avatar
[Screenshot here]

### Activity Logs (Admin)
[Screenshot here]

### Redux DevTools
[Screenshot here]

---

## 🎥 Demo Video

[Link to video demo - 15-20 minutes]

**Video includes:**
- Feature walkthrough
- Code explanation
- Testing all scenarios
- Redux state management demo

---

## 📝 Documentation

Detailed documentation for each activity:
- [HOAT_DONG_1_REFRESH_TOKEN.md](HOAT_DONG_1_REFRESH_TOKEN.md)
- [HOAT_DONG_2_RBAC_FRONTEND.md](HOAT_DONG_2_RBAC_FRONTEND.md)
- [HOAT_DONG_3_UPLOAD_AVATAR_FRONTEND.md](HOAT_DONG_3_UPLOAD_AVATAR_FRONTEND.md)
- [HOAT_DONG_4_FORGOT_RESET_PASSWORD_FRONTEND.md](HOAT_DONG_4_FORGOT_RESET_PASSWORD_FRONTEND.md)
- [HOAT_DONG_5_ACTIVITY_LOGGING_FRONTEND.md](HOAT_DONG_5_ACTIVITY_LOGGING_FRONTEND.md)
- [HOAT_DONG_6_REDUX_PROTECTED_ROUTES.md](HOAT_DONG_6_REDUX_PROTECTED_ROUTES.md)

---

## 🐛 Known Issues & Fixes

### Port Configuration
- Backend MUST run on port 5000
- All API calls use `localhost:5000`
- See [FIX_PORT_MISMATCH.md](FIX_PORT_MISMATCH.md)

### Avatar Upload
- URL returned from backend uses correct port
- See [FIX_AVATAR_NOT_DISPLAY.md](FIX_AVATAR_NOT_DISPLAY.md)

### Signup/Login
- Backend now saves registered accounts
- See [FIX_SIGNUP_LOGIN_ISSUE.md](FIX_SIGNUP_LOGIN_ISSUE.md)

---

## 🚧 Future Enhancements

- [ ] MongoDB integration
- [ ] Email service for password reset
- [ ] Real-time notifications
- [ ] Advanced admin dashboard
- [ ] User profile customization
- [ ] 2FA authentication
- [ ] Social login (Google, Facebook)

---

## 📄 License

MIT License - Free to use for educational purposes

---

## 🙏 Acknowledgments

- Instructor: [Tên giảng viên]
- Course: Advanced Web Development
- School: [Tên trường]

---

## 📞 Contact

- GitHub: [@NguyenToanThanh](https://github.com/NguyenToanThanh)
- Project Link: [group12-project](https://github.com/NguyenToanThanh/group12-project)

---

**Last Updated:** October 19, 2025
\`\`\`

---

## 🎯 CHECKLIST HOÀN THÀNH

### Git & GitHub:
- [ ] Hủy merge conflict hiện tại
- [ ] Xóa file frontend/NUL
- [ ] Commit tất cả code
- [ ] Push nhánh feature/refresh-token lên GitHub
- [ ] Tạo Pull Request
- [ ] Merge vào main (nếu có quyền)

### Documentation:
- [ ] Tạo README.md hoàn chỉnh
- [ ] Review tất cả HOAT_DONG_*.md files
- [ ] Add screenshots vào README
- [ ] Commit và push README

### Testing:
- [ ] Test toàn bộ flow
- [ ] Chụp screenshots
- [ ] Fix bugs nếu có

### Video Demo:
- [ ] Record video 15-20 phút
- [ ] Upload video
- [ ] Add link vào README

### Submission:
- [ ] GitHub repo link
- [ ] Video demo link
- [ ] Screenshots
- [ ] Documentation complete

---

**BẮT ĐẦU NGAY TỪ BƯỚC 1!** 🚀

Sau khi hoàn thành các bước trên, repo GitHub của bạn sẽ sạch sẽ, có đầy đủ code và documentation, sẵn sàng để nộp bài!
\`\`\`
