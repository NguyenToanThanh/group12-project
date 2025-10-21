# 🚀 Hướng Dẫn Deploy Frontend React lên Vercel

## 📦 Chuẩn Bị

### ✅ Checklist Trước Khi Deploy:
- [x] Code frontend đã hoàn thành và test kỹ
- [x] Đã push code lên GitHub repository
- [x] File `vercel.json` đã được tạo trong thư mục `frontend/`
- [x] Package.json có script `build`

---

## 🎯 Bước 1: Chuẩn Bị Repository

### 1.1 Đảm bảo code đã được push lên GitHub

```bash
cd c:\Users\pc\group12-project
git status
git add .
git commit -m "Prepare for Vercel deployment"
git push origin feature/refresh-token
```

### 1.2 Merge vào nhánh main (nếu cần)

Nếu cần deploy từ nhánh main:
```bash
git checkout main
git merge feature/refresh-token
git push origin main
```

---

## 🌐 Bước 2: Deploy lên Vercel

### 2.1 Truy cập Vercel

1. Mở trình duyệt, vào: **https://vercel.com**
2. Click **"Sign Up"** hoặc **"Log In"**
3. Chọn **"Continue with GitHub"** để đăng nhập bằng GitHub

### 2.2 Import Project từ GitHub

1. Sau khi đăng nhập, click **"Add New..."** → **"Project"**
2. Vercel sẽ hiển thị danh sách repositories từ GitHub
3. Tìm repository **"NguyenToanThanh/group12-project"**
4. Click **"Import"**

### 2.3 Cấu hình Project

**Framework Preset:** React  
**Root Directory:** `frontend` (⚠️ QUAN TRỌNG - chọn thư mục frontend)  
**Build Command:** `npm run build` (mặc định)  
**Output Directory:** `build` (mặc định)  

### 2.4 Thêm Environment Variables

Trong phần **"Environment Variables"**, thêm:

| Key | Value | Ghi chú |
|-----|-------|---------|
| `REACT_APP_API_BASE` | `http://localhost:5000/api` | Tạm thời dùng localhost, sau khi deploy backend sẽ đổi |

⚠️ **Lưu ý**: Sau khi deploy backend, cần cập nhật biến này thành URL backend production.

### 2.5 Deploy

1. Click **"Deploy"**
2. Vercel sẽ bắt đầu build và deploy
3. Chờ khoảng 2-3 phút
4. Sau khi deploy xong, Vercel sẽ cung cấp URL dạng: `https://your-project-name.vercel.app`

---

## 🎉 Bước 3: Kiểm Tra Deployment

### 3.1 Truy cập URL

1. Click vào URL Vercel cung cấp
2. Kiểm tra xem ứng dụng có load được không

### 3.2 Test Các Tính Năng

✅ Trang chủ hiển thị đúng  
✅ Đăng ký/Đăng nhập (sẽ lỗi vì backend chưa deploy)  
✅ Routing hoạt động (các trang /login, /signup, /profile)  

⚠️ **Lưu ý**: Các tính năng cần API (login, signup, etc.) sẽ **chưa hoạt động** vì backend vẫn đang chạy local.

---

## 🔧 Bước 4: Cấu Hình Domain (Tùy chọn)

### 4.1 Domain mặc định Vercel

Vercel tự động cấp domain: `https://your-project-name.vercel.app`

### 4.2 Đổi tên project (nếu muốn)

1. Vào **Project Settings** → **General**
2. Tìm mục **"Project Name"**
3. Đổi tên thành tên dễ nhớ (ví dụ: `group12-rbac-frontend`)
4. Domain mới: `https://group12-rbac-frontend.vercel.app`

---

## 🐛 Troubleshooting (Xử Lý Lỗi)

### Lỗi 1: Build Failed

**Nguyên nhân**: Lỗi compile code  
**Giải pháp**:
- Chạy `npm run build` ở local để kiểm tra
- Sửa lỗi code
- Push lại lên GitHub
- Vercel sẽ tự động rebuild

### Lỗi 2: 404 Not Found khi refresh trang

**Nguyên nhân**: Vercel chưa config routing cho SPA  
**Giải pháp**: File `vercel.json` đã được tạo để xử lý vấn đề này

### Lỗi 3: API calls failed (CORS error)

**Nguyên nhân**: Backend chưa deploy hoặc CORS chưa config đúng  
**Giải pháp**:
1. Deploy backend trước
2. Cập nhật `REACT_APP_API_BASE` trong Vercel Settings → Environment Variables
3. Redeploy frontend

### Lỗi 4: Environment variables không hoạt động

**Nguyên nhân**: Biến môi trường không được load  
**Giải pháp**:
- Đảm bảo biến có prefix `REACT_APP_`
- Sau khi thêm biến mới, phải **redeploy** project

---

## 🔄 Bước 5: Cập Nhật Sau Khi Sửa Code

### 5.1 Auto Deployment (Tự động)

Vercel tự động deploy khi bạn push code lên GitHub:

```bash
git add .
git commit -m "Update feature X"
git push origin feature/refresh-token
```

→ Vercel sẽ tự động build và deploy phiên bản mới

### 5.2 Manual Redeploy (Thủ công)

1. Vào Vercel Dashboard
2. Chọn project
3. Tab **"Deployments"**
4. Click nút **"..."** ở deployment muốn redeploy
5. Chọn **"Redeploy"**

---

## 📊 Bước 6: Monitoring và Logs

### 6.1 Xem Deployment Logs

1. Vào **Deployments** tab
2. Click vào deployment muốn xem
3. Xem **"Build Logs"** và **"Function Logs"**

### 6.2 Analytics

Vercel cung cấp analytics miễn phí:
- Page views
- Unique visitors
- Top pages

---

## 🎓 Ghi Chép Cho Báo Cáo

### Thông tin cần ghi:

1. **Deployment URL**: https://your-project-name.vercel.app
2. **Framework**: React 19.2.0
3. **Build Tool**: Create React App (react-scripts 5.0.1)
4. **Hosting Platform**: Vercel
5. **Root Directory**: `frontend/`
6. **Output Directory**: `build/`
7. **Deployment Time**: ~2-3 phút

### Screenshots cần chụp:

1. ✅ Vercel Dashboard với project đã deploy
2. ✅ Build logs thành công
3. ✅ Trang web đang chạy trên Vercel URL
4. ✅ Environment variables settings
5. ✅ Domain settings

---

## ⚡ Tips và Best Practices

### 1. Sử dụng Environment Variables

Không hardcode URL backend trong code. Luôn dùng:
```javascript
const API_URL = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';
```

### 2. Optimize Build

Để giảm thời gian build:
- Remove unused dependencies
- Use code splitting
- Optimize images

### 3. Monitor Performance

- Sử dụng Vercel Analytics để theo dõi performance
- Kiểm tra Lighthouse scores
- Optimize bundle size

### 4. Security

- Không commit file `.env` lên GitHub
- Sử dụng Environment Variables trên Vercel
- Enable HTTPS (Vercel tự động hỗ trợ)

---

## 📝 Checklist Hoàn Thành Deploy

- [ ] Đã đăng ký tài khoản Vercel
- [ ] Đã kết nối GitHub với Vercel
- [ ] Đã import project từ GitHub
- [ ] Đã chọn đúng Root Directory (`frontend/`)
- [ ] Đã thêm Environment Variables
- [ ] Deploy thành công
- [ ] Kiểm tra URL hoạt động
- [ ] Chụp screenshots cho báo cáo
- [ ] Ghi lại Deployment URL

---

## 🎯 Bước Tiếp Theo

Sau khi deploy frontend xong:

1. **Deploy Backend** (nếu cần)
   - Backend cũng có thể deploy lên Vercel
   - Hoặc dùng Render, Railway, Heroku

2. **Cập nhật API URL**
   - Sau khi backend deploy xong
   - Update `REACT_APP_API_BASE` trên Vercel
   - Redeploy frontend

3. **Test End-to-End**
   - Test đầy đủ các tính năng
   - Login, Signup, RBAC, Upload Avatar, etc.

4. **Hoàn thành báo cáo**
   - Screenshots
   - Video demo
   - Link deployment

---

## 📞 Hỗ Trợ

Nếu gặp vấn đề:
- Vercel Docs: https://vercel.com/docs
- Vercel Discord: https://vercel.com/discord
- GitHub Issues: https://github.com/vercel/vercel/issues

---

**Chúc bạn deploy thành công! 🚀**
