# 📸 HOẠT ĐỘNG 3 - UPLOAD AVATAR (Frontend SV2)

## ✅ ĐÃ HOÀN THÀNH

### Backend (Đã có sẵn):
- ✅ API `/api/upload-avatar` với Multer
- ✅ Lưu file vào `backend/uploads/`
- ✅ Trả về URL: `http://localhost:4000/uploads/{filename}`
- ✅ CORS đã config cho localhost:3000

### Frontend (Vừa tạo):
- ✅ Component `UploadAvatar.jsx` trong `src/pages/profile/`
- ✅ Form upload với input file
- ✅ Preview ảnh trước khi upload
- ✅ Upload lên backend qua FormData
- ✅ Hiển thị avatar sau khi upload thành công
- ✅ Route `/upload-avatar` trong App.jsx
- ✅ Link "Upload Avatar" trên navbar

---

## 🎯 CÁCH TEST

### Bước 1: Mở trang Upload Avatar
1. Truy cập: **http://localhost:3000/upload-avatar**
2. Hoặc click link **"Upload Avatar"** trên navbar

### Bước 2: Chọn ảnh
1. Click nút **"📁 Chọn ảnh"**
2. Chọn file ảnh (JPG, PNG, GIF, WEBP)
3. Kích thước tối đa: **5MB**

**Kết quả:**
- Hiển thị tên file và kích thước
- Xuất hiện **Preview** ảnh bên dưới

### Bước 3: Upload
1. Click nút **"🚀 Upload Avatar"**
2. Chờ message "⏳ Đang upload..."

**Kết quả:**
- Message: "✅ Upload thành công!"
- Hiển thị avatar hình tròn màu xanh
- URL: `http://localhost:4000/uploads/1234567890-123456789.jpg`
- Console log: `📸 Avatar URL: ...`

### Bước 4: Kiểm tra ảnh
1. Click chuột phải vào avatar → **"Open image in new tab"**
2. Xem ảnh được serve từ backend

---

## 📸 YÊU CẦU SCREENSHOTS

Chụp **3 ảnh** để nộp bài:

### 1. **Trước upload**
- Form hiển thị nút "Chọn ảnh"
- Chưa có preview

### 2. **Sau chọn ảnh (có Preview)**
- Hiển thị tên file
- Preview ảnh
- Nút "Upload Avatar" sáng (có thể click)

### 3. **Sau upload thành công**
- Message "✅ Upload thành công!"
- Avatar hiển thị hình tròn viền xanh
- URL đầy đủ
- Console log (F12) hiển thị `📸 Avatar URL`

---

## 🔧 KIỂM TRA KỸ THUẬT

### Backend logs (Terminal)
```
✅ Uploaded: 1734567890-123456789.jpg
```

### Frontend Console (F12)
```javascript
📸 Avatar URL: http://localhost:4000/uploads/1734567890-123456789.jpg
```

### File được lưu
```
backend/uploads/1734567890-123456789.jpg
```

---

## ⚠️ XỬ LÝ LỖI

### Lỗi: "Chỉ chấp nhận file ảnh"
- **Nguyên nhân:** Chọn file không phải ảnh (PDF, Word, ...)
- **Giải pháp:** Chọn file JPG, PNG, GIF, WEBP

### Lỗi: "File quá lớn! Tối đa 5MB"
- **Nguyên nhân:** File > 5MB
- **Giải pháp:** Resize ảnh trước khi upload (dùng Paint, Photoshop, online tool)

### Lỗi: "Không có file"
- **Nguyên nhân:** Backend không nhận được file
- **Giải pháp:** Kiểm tra FormData, field name phải là `"avatar"`

### Lỗi: Network Error / ERR_CONNECTION_REFUSED
- **Nguyên nhân:** Backend không chạy
- **Giải pháp:** `cd backend; node index.js`

---

## 🚀 TÍNH NĂNG ĐÃ CÓ

### Validate
- ✅ Kiểm tra định dạng file (image/*)
- ✅ Kiểm tra kích thước (max 5MB)
- ✅ Hiển thị thông báo lỗi rõ ràng

### UI/UX
- ✅ Preview ảnh trước khi upload
- ✅ Loading state khi đang upload
- ✅ Disable button khi chưa chọn file
- ✅ Avatar hiển thị hình tròn sau upload
- ✅ Message màu sắc (xanh = success, đỏ = error, cam = loading)

### Technical
- ✅ FormData để upload file
- ✅ Axios POST với Content-Type: multipart/form-data
- ✅ FileReader để tạo preview
- ✅ Responsive design

---

## 📝 GHI CHÚ

**Hoạt động 3 này chỉ upload LOCAL (backend/uploads/).**

Để production, cần:
- **SV1 Backend:** Tích hợp Cloudinary API (sharp + cloudinary SDK)
- **SV3 Backend:** Lưu URL avatar vào MongoDB collection `users`

Frontend không cần sửa gì (vẫn POST `/api/upload-avatar`, nhận URL từ response).

---

## ✅ HOÀN THÀNH HOẠT ĐỘNG 3

Khi:
- ✅ Upload ảnh thành công
- ✅ Preview hiển thị đúng
- ✅ Avatar hiển thị sau upload
- ✅ URL trả về đúng format
- ✅ Console log đầy đủ
- ✅ Có 3 screenshots

→ **Frontend Member 2 hoàn thành nhiệm vụ!** 🎉
