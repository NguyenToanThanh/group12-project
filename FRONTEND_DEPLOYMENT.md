# 🚀 Frontend Deployment - Member #2

## 📋 Thông Tin Deploy

**Thành viên**: Frontend Member #2  
**Framework**: React 19.2.0  
**Platform**: Vercel  
**Repository**: https://github.com/NguyenToanThanh/group12-project

---

## ✅ Checklist Hoàn Thành

### Chuẩn Bị
- [x] Code frontend hoàn chỉnh (Activities 1-6)
- [x] Đã test kỹ local (localhost:3000)
- [x] Đã push code lên GitHub
- [x] Tạo file `vercel.json` với config routing
- [x] Tạo file `.env.example` hướng dẫn env variables

### Deploy lên Vercel
- [ ] Đăng nhập Vercel với GitHub
- [ ] Import repository từ GitHub
- [ ] Chọn Root Directory: `frontend/`
- [ ] Config Build Settings:
  - Framework: React
  - Build Command: `npm run build`
  - Output Directory: `build/`
- [ ] Thêm Environment Variables:
  - `REACT_APP_API_BASE`: URL của backend API
- [ ] Deploy thành công
- [ ] Kiểm tra URL hoạt động

### Sau Deploy
- [ ] Test routing (/, /login, /signup, /profile, etc.)
- [ ] Chụp screenshots (tối thiểu 5 ảnh)
- [ ] Ghi lại deployment URL
- [ ] Cập nhật README.md với link production

---

## 🌐 Deployment URL

**Production URL**: `https://[your-project-name].vercel.app`

*(Cập nhật URL sau khi deploy xong)*

---

## ⚙️ Build Configuration

### Framework Preset
```
React
```

### Root Directory
```
frontend/
```

### Build Command
```bash
npm run build
```

### Output Directory
```
build
```

### Install Command (mặc định)
```bash
npm install
```

---

## 🔐 Environment Variables

Cần thêm trong Vercel Settings → Environment Variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `REACT_APP_API_BASE` | `https://your-backend.vercel.app/api` | Backend API URL |

**Lưu ý**: 
- Biến phải có prefix `REACT_APP_` để Create React App nhận diện
- Sau khi deploy backend, cần update biến này và redeploy

---

## 📁 File Structure

```
frontend/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── api/
│   │   └── axios.js          # API client với REACT_APP_API_BASE
│   ├── components/
│   │   ├── ProtectedRoute.jsx
│   │   └── RoleGate.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── profile/
│   │   │   ├── Profile.jsx
│   │   │   └── UploadAvatar.jsx
│   │   ├── Auth/
│   │   │   ├── ForgotPassword.jsx
│   │   │   └── ResetPassword.jsx
│   │   ├── moderator/
│   │   │   └── ModeratorTools.jsx
│   │   └── admin/
│   │       ├── AdminDashboard.jsx
│   │       └── ActivityLogs.jsx
│   ├── redux/
│   │   ├── store.js
│   │   └── authSlice.js
│   ├── App.js
│   └── index.js
├── package.json
├── vercel.json              # Vercel config cho SPA routing
└── .env.example             # Template cho env variables
```

---

## 🎯 Features Deployed

### Authentication & Authorization
- ✅ JWT-based authentication
- ✅ Refresh token mechanism
- ✅ Protected routes
- ✅ Role-based access control (Admin, Moderator, User)

### User Features
- ✅ Sign up / Login / Logout
- ✅ View profile
- ✅ Upload avatar
- ✅ Forgot password
- ✅ Reset password

### Admin Features (Admin only)
- ✅ Admin Dashboard
- ✅ View activity logs
- ✅ Manage users

### Moderator Features (Moderator + Admin)
- ✅ Moderator Tools
- ✅ Review and approve/reject posts

---

## 🧪 Testing Deployed App

### Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | 123456 |
| Moderator | mod@example.com | 123456 |
| User | user@example.com | 123456 |

### Test Cases

1. **Routing**
   - Navigate to different pages
   - Refresh page (should not get 404)
   - Protected routes redirect to /login if not authenticated

2. **Authentication** *(sẽ hoạt động sau khi deploy backend)*
   - Login with different roles
   - View appropriate features based on role
   - Logout

3. **RBAC**
   - Admin sees all features
   - Moderator sees moderator tools (no admin panel)
   - User sees basic features only

---

## 🐛 Common Issues & Solutions

### Issue 1: 404 on Page Refresh
**Solution**: File `vercel.json` đã config routing để forward tất cả requests về `index.html`

### Issue 2: API Calls Fail
**Solution**: 
- Kiểm tra backend đã deploy chưa
- Kiểm tra `REACT_APP_API_BASE` đã set đúng chưa
- Kiểm tra CORS config trên backend

### Issue 3: Environment Variables Not Working
**Solution**:
- Đảm bảo biến có prefix `REACT_APP_`
- Sau khi thêm/sửa biến, phải **Redeploy**
- Clear browser cache

### Issue 4: Build Failed
**Solution**:
- Chạy `npm run build` ở local để debug
- Check build logs trên Vercel
- Đảm bảo tất cả dependencies đã được install

---

## 📸 Screenshots Checklist

Cần chụp cho báo cáo:

1. ✅ Vercel Dashboard showing successful deployment
2. ✅ Build logs (successful)
3. ✅ Environment Variables settings
4. ✅ Production URL với app đang chạy
5. ✅ Login page
6. ✅ Admin dashboard (với admin role)
7. ✅ Moderator tools (với moderator role)
8. ✅ User profile
9. ✅ Mobile responsive view (optional)
10. ✅ Performance metrics (optional)

---

## 🎥 Video Demo Checklist

Nội dung cần có trong video (15-20 phút):

1. Giới thiệu project và deployment URL
2. Show code trên GitHub repository
3. Show Vercel dashboard và settings
4. Demo các tính năng:
   - Login với 3 roles khác nhau
   - RBAC (Admin, Moderator, User)
   - Profile, Upload Avatar
   - Forgot/Reset Password
   - Moderator Tools
   - Admin Panel
5. Kết luận và tổng kết

---

## 📊 Performance Metrics

Sau khi deploy, kiểm tra:

- **Build Time**: ~2-3 phút
- **Page Load Time**: < 3 giây
- **Lighthouse Score**: 
  - Performance: > 80
  - Accessibility: > 90
  - Best Practices: > 90
  - SEO: > 90

---

## 🔗 Links Quan Trọng

- **GitHub Repo**: https://github.com/NguyenToanThanh/group12-project
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Production URL**: *(Cập nhật sau khi deploy)*
- **Documentation**: Xem file `HUONG_DAN_DEPLOY_VERCEL.md`

---

## 👥 Team Info

**Project**: Group 12 - RBAC Web Application  
**Member #2**: Frontend Developer  
**Responsibilities**:
- Implement all frontend features (Activities 1-6)
- Setup Redux state management
- Implement routing and protected routes
- Deploy frontend to Vercel

---

## ✅ Final Checklist

- [ ] Code hoàn chỉnh và đã push lên GitHub
- [ ] Deploy thành công lên Vercel
- [ ] URL production hoạt động
- [ ] Test các tính năng cơ bản
- [ ] Chụp screenshots (tối thiểu 10 ảnh)
- [ ] Quay video demo (15-20 phút)
- [ ] Cập nhật README.md với deployment URL
- [ ] Hoàn thành báo cáo

---

**Status**: 🚀 Ready to Deploy!

**Last Updated**: October 21, 2025
