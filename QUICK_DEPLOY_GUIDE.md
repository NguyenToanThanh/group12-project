# ⚡ Quick Start - Deploy Frontend lên Vercel

## 🎯 5 Bước Deploy Nhanh (10 phút)

### Bước 1: Vào Vercel (2 phút)
1. Mở https://vercel.com
2. Click **"Sign Up"** → Chọn **"Continue with GitHub"**
3. Đăng nhập GitHub và authorize Vercel

### Bước 2: Import Project (3 phút)
1. Click **"Add New..."** → **"Project"**
2. Tìm repository: **"NguyenToanThanh/group12-project"**
3. Click **"Import"**

### Bước 3: Configure Settings (3 phút)
**⚠️ QUAN TRỌNG - Nhập chính xác:**

| Setting | Value |
|---------|-------|
| Framework Preset | **React** |
| Root Directory | **frontend** ← Click "Edit" và chọn |
| Build Command | `npm run build` (mặc định) |
| Output Directory | `build` (mặc định) |

**Environment Variables:**
- Key: `REACT_APP_API_BASE`
- Value: `http://localhost:5000/api` (tạm thời)

### Bước 4: Deploy (2 phút)
1. Click **"Deploy"**
2. Chờ build xong (~2-3 phút)
3. Vercel sẽ hiển thị **"Congratulations!"**

### Bước 5: Test (2 phút)
1. Click vào URL Vercel cung cấp (dạng: `https://abc123.vercel.app`)
2. Kiểm tra:
   - ✅ Trang chủ hiển thị
   - ✅ Click vào Login, Signup
   - ✅ Routing hoạt động

---

## ✅ Xong! 

**Deployment URL của bạn**: *(Copy từ Vercel)*

---

## 📸 Cần Làm Tiếp

1. **Chụp screenshots** (10 ảnh):
   - Vercel dashboard
   - Build logs
   - App đang chạy
   - Login/Signup pages
   - Profile page
   - Admin panel (với admin role)
   - Moderator tools
   - Environment variables settings
   - Domain settings
   - Performance metrics

2. **Quay video demo** (15-20 phút):
   - Giới thiệu project
   - Show GitHub repository
   - Show Vercel deployment process
   - Demo đầy đủ tính năng
   - Login với 3 roles
   - Test RBAC
   - Upload avatar
   - Forgot/Reset password

3. **Cập nhật README.md**:
   - Thêm link deployment URL
   - Thêm hướng dẫn sử dụng

---

## 🐛 Nếu Gặp Lỗi

### Build Failed?
→ Xem file `HUONG_DAN_DEPLOY_VERCEL.md` phần Troubleshooting

### 404 Not Found?
→ File `vercel.json` đã được tạo, redeploy lại

### API không hoạt động?
→ Đúng rồi! Backend vẫn đang local. Sau khi deploy backend mới update URL

---

## 📝 Ghi Chú Cho Báo Cáo

**Deployment URL**: `https://[your-url].vercel.app`  
**Platform**: Vercel  
**Framework**: React 19.2.0  
**Build Time**: ~2-3 phút  
**Status**: ✅ Deployed Successfully

---

**Chi tiết đầy đủ**: Xem file `HUONG_DAN_DEPLOY_VERCEL.md`
