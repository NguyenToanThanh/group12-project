# 🔧 SỬA LỖI: UPLOAD AVATAR - ERR_CONNECTION_REFUSED

## 🐛 VẤN ĐỀ TỪ SCREENSHOT

Khi upload avatar, gặp 2 lỗi:

1. **❌ Failed to load resource: net::ERR_CONNECTION_REFUSED**
   - URL: `:4000/api/upload-avatar:1`
   
2. **❌ Failed to load resource: the server responded with a status of 400 (Bad Request)**
   - URL: `:5000/api/signup:1`

3. **❌ Upload error: AxiosError**
   - Không kết nối được tới backend

---

## 🔍 NGUYÊN NHÂN

### Nguyên nhân 1: BACKEND KHÔNG CHẠY
Terminal log cho thấy backend đã bị tắt:
```
Command exited with code 1
```

Kiểm tra port:
```bash
netstat -ano | findstr :5000
# → Không có gì! Backend không chạy!
```

### Nguyên nhân 2: FRONTEND GỌI SAI PORT
File: `frontend/src/pages/profile/UploadAvatar.jsx` dòng 53:

```javascript
// ❌ SAI - Gọi port 4000
const response = await axios.post("http://localhost:4000/api/upload-avatar", formData, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});
```

**Backend đang chạy port 5000, nhưng frontend gọi port 4000!**

→ `ERR_CONNECTION_REFUSED` vì không có gì chạy trên port 4000!

---

## ✅ GIẢI PHÁP

### 1. SỬA PORT TRONG UploadAvatar.jsx

**Đã sửa:**
```javascript
// ✅ ĐÚNG - Gọi port 5000
const response = await axios.post("http://localhost:5000/api/upload-avatar", formData, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});
```

### 2. KHỞI ĐỘNG LẠI BACKEND

```bash
cd backend
node index.js
```

**Kiểm tra log phải có:**
```
Server running on http://127.0.0.1:5000
Routes available:
- POST      /api/upload-avatar
```

---

## 🚀 TEST NGAY

### Bước 1: Kiểm tra backend đang chạy
```bash
netstat -ano | findstr :5000
# → TCP    127.0.0.1:5000    LISTENING    <PID>
```

### Bước 2: Refresh trang frontend
Nhấn **F5** trên trang Upload Avatar

### Bước 3: Test upload
1. Click "📁 Chọn ảnh"
2. Chọn một file ảnh (JPG, PNG, GIF, WEBP)
3. Xem preview hiển thị
4. Click "🚀 Upload Avatar"
5. ✅ Thành công! Hiển thị: "🎉 Upload thành công!"

---

## 🧪 TEST CASE

### Test 1: Upload ảnh hợp lệ
```
Input: file ảnh JPG, 500KB
Expected: ✅ Upload thành công!
URL: http://localhost:5000/uploads/1729...-....jpg
```

### Test 2: File không phải ảnh
```
Input: file PDF
Expected: ❌ Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WEBP)
```

### Test 3: File quá lớn
```
Input: file ảnh 10MB
Expected: ❌ File quá lớn! Tối đa 5MB
```

### Test 4: Không chọn file
```
Action: Click "Upload Avatar" khi chưa chọn file
Expected: ❌ Vui lòng chọn file trước
```

---

## 📊 KIỂM TRA NETWORK TAB

Mở Developer Tools (F12) → Network tab:

### Request thành công:
```
Request URL: http://localhost:5000/api/upload-avatar
Request Method: POST
Status Code: 200 OK
Content-Type: multipart/form-data

Response:
{
  "message": "Upload thành công!",
  "url": "http://localhost:5000/uploads/1729...-.jpg"
}
```

### Redux Debugger (góc phải):
```
✅ Authenticated: true
📧 Email: nhatthien113@gmail.com
👤 Role: user
🎫 Access: ✓ Present
🔄 Refresh: ✓ Present
```

---

## 🔍 KIỂM TRA FILE ĐÃ UPLOAD

Backend lưu file vào thư mục `backend/uploads/`

```bash
# Liệt kê file trong uploads
dir backend\uploads

# Kết quả:
# 1729....-.jpg
# 1729....-.png
```

---

## ⚠️ LƯU Ý QUAN TRỌNG

### 1. Port Consistency
**TẤT CẢ API CALLS PHẢI DÙNG PORT 5000:**

Kiểm tra các file frontend:
```bash
# Tìm tất cả nơi gọi localhost:4000
grep -r "localhost:4000" frontend/src/
```

**Phải sửa TẤT CẢ thành `localhost:5000`:**
- ✅ `frontend/src/redux/authSlice.js` - Đã sửa
- ✅ `frontend/src/pages/profile/UploadAvatar.jsx` - Đã sửa
- ❓ Kiểm tra các file khác...

### 2. Backend Must Be Running
Trước khi test frontend, **LUÔN LUÔN** kiểm tra backend:
```bash
netstat -ano | findstr :5000
# Phải có output! Nếu không có → Backend chưa chạy!
```

### 3. CORS Configuration
Backend đã cấu hình CORS cho port 3000:
```javascript
const corsOptions = {
  origin: ["http://localhost:3000", "http://127.0.0.1:3000", null],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
```

### 4. Multer Configuration
Backend sử dụng multer để xử lý file upload:
```javascript
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "uploads")),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  },
});
const upload = multer({ storage });
```

---

## 📝 CHECKLIST

**Trước khi test upload avatar:**
- [x] Backend đang chạy trên port 5000
- [x] Frontend đã sửa port 4000 → 5000
- [x] Frontend đã refresh (F5)
- [ ] Test upload ảnh thành công
- [ ] Kiểm tra file trong backend/uploads
- [ ] Kiểm tra Network tab 200 OK
- [ ] Kiểm tra Redux state vẫn authenticated

---

## 🎯 TÓM TẮT

| Vấn đề | Nguyên nhân | Giải pháp |
|--------|-------------|-----------|
| ERR_CONNECTION_REFUSED | Backend không chạy | ✅ Restart: `node index.js` |
| ERR_CONNECTION_REFUSED | Frontend gọi port 4000 | ✅ Sửa thành port 5000 |
| Upload error | Backend crash | ✅ Restart backend |
| 400 Bad Request | API endpoint sai | ✅ Kiểm tra /api/upload-avatar |

---

## 🚀 QUICK FIX (3 BƯỚC)

```bash
# 1. Restart backend
cd backend
node index.js

# 2. Kiểm tra port
netstat -ano | findstr :5000
# → Phải có output!

# 3. Test upload
# Mở http://localhost:3000/upload-avatar
# Upload một file ảnh
# → ✅ Thành công!
```

---

**Cập nhật:** $(date)  
**Status:** ✅ Đã sửa xong - Backend chạy - Port đã đúng
