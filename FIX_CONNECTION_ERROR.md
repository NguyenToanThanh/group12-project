# 🔧 KHẮC PHỤC LỖI "ERR_CONNECTION_REFUSED"

## ❌ VẤN ĐỀ

Lỗi: **"Failed to load resource: net::ERR_CONNECTION_REFUSED :3001/api"**

**Nguyên nhân:** Frontend đang cố gọi API ở port **3001**, nhưng backend đang chạy ở port **4000**.

---

## ✅ ĐÃ SỬA

Đã thay đổi **5 files** từ port 3001 → 4000:

1. ✅ `frontend/src/api/axios.js`
   ```javascript
   // Trước: http://127.0.0.1:3001/api
   // Sau:   http://localhost:4000/api
   ```

2. ✅ `frontend/src/api/axiosInstance.js`
   ```javascript
   // Trước: http://localhost:3000/api
   // Sau:   http://localhost:4000/api
   ```

3. ✅ `frontend/src/api/axiosClient.js`
   ```javascript
   // Fallback URL đã sửa thành http://localhost:4000/api
   ```

4. ✅ `frontend/src/App.js`
   ```javascript
   // Trước: http://localhost:3001/api
   // Sau:   http://localhost:4000/api
   ```

5. ✅ `frontend/.env`
   ```
   REACT_APP_API_BASE_URL=http://localhost:4000/api
   ```

---

## 🚀 CÁC BƯỚC TIẾP THEO

### Bước 1: Backend đã chạy ✅

Backend đang chạy tại: **http://localhost:4000**

Test backend:
```powershell
curl http://localhost:4000/api/profile
```

### Bước 2: RESTART Frontend

**Quan trọng:** Phải restart frontend để load config mới!

#### Cách 1: Trong terminal hiện tại
```powershell
# Nhấn Ctrl+C để dừng
# Sau đó chạy lại:
npm start
```

#### Cách 2: Mở terminal mới
```powershell
cd C:\Users\pc\group12-project\frontend
npm start
```

### Bước 3: Kiểm tra

1. Đợi frontend compile xong
2. Mở trình duyệt: **http://localhost:3000**
3. Mở DevTools (F12) → tab **Console**
4. **KHÔNG còn** thấy lỗi "ERR_CONNECTION_REFUSED :3001"

### Bước 4: Test Login

1. Click **"Đăng nhập"**
2. Nhập:
   - Email: `test@example.com`
   - Password: `123456`
3. Click **"Đăng nhập"**
4. Kiểm tra Console → Phải thấy:
   ```
   🔐 Đăng nhập với: {email: "test@example.com"}
   📡 Đang gọi API: POST http://localhost:4000/api/login
   📦 Response: {...}
   ✅ Đăng nhập thành công!
   ```

---

## 🧪 KIỂM TRA CẤU HÌNH

Chạy lệnh này trong Console (F12):

```javascript
// Kiểm tra env variable
console.log('ENV:', process.env.REACT_APP_API_BASE_URL);

// Test API call
fetch('http://localhost:4000/api/profile')
  .then(res => res.json())
  .then(data => console.log('✅ Backend OK:', data))
  .catch(err => console.error('❌ Lỗi:', err));
```

**Kết quả mong đợi:**
```
ENV: http://localhost:4000/api
✅ Backend OK: {name: "Admin", email: "admin@mail.com", ...}
```

---

## 🔍 NẾU VẪN LỖI

### Lỗi: "ERR_CONNECTION_REFUSED :4000"

**Nguyên nhân:** Backend không chạy hoặc bị crash

**Giải pháp:**
```powershell
# Kiểm tra backend có chạy không
netstat -ano | findstr :4000

# Nếu không có kết quả → backend không chạy
# Restart backend:
cd C:\Users\pc\group12-project\backend
node index.js
```

### Lỗi: "CORS policy"

**Nguyên nhân:** Backend CORS chưa cho phép origin

**Giải pháp:** Đã fix trong `backend/index.js`:
```javascript
const corsOptions = {
  origin: ["http://localhost:3000", "http://127.0.0.1:3000", null],
  credentials: true,
  // ...
};
```

### Lỗi: Vẫn thấy ":3001" trong Console

**Nguyên nhân:** Frontend chưa restart hoặc cache

**Giải pháp:**
1. Dừng frontend (Ctrl+C)
2. Xóa cache:
   ```powershell
   Remove-Item -Recurse -Force "node_modules/.cache"
   ```
3. Chạy lại: `npm start`
4. Hoặc Hard Reload: **Ctrl + Shift + R**

---

## 📊 TÓM TẮT

| Component | Port | Status |
|-----------|------|--------|
| Backend | 4000 | ✅ Running |
| Frontend | 3000 | ⚠️ Cần restart |
| API calls | 4000 | ✅ Đã sửa |

---

## 🎯 CHECKLIST

- [x] Sửa axios.js → port 4000
- [x] Sửa axiosInstance.js → port 4000
- [x] Sửa axiosClient.js → port 4000
- [x] Sửa App.js → port 4000
- [x] Sửa .env → port 4000
- [x] Backend đang chạy port 4000
- [ ] **RESTART frontend** ← BẠN CẦN LÀM BƯỚC NÀY!
- [ ] Test login thành công
- [ ] Không còn lỗi trong Console

---

**Sau khi restart frontend, lỗi sẽ biến mất! 🎉**
