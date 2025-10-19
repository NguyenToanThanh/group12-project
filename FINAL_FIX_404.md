# 🔧 KHẮC PHỤC LỖI 404 - FINAL FIX

## ❌ VẤN ĐỀ

Lỗi trong Console:
```
GET http://localhost:4000/api 404 (Not Found)
```

**Nguyên nhân:** 
1. Frontend compile lại nhưng vẫn load **code cũ** từ cache
2. Có component nào đó đang auto-fetch API khi load
3. Service Worker hoặc browser cache

---

## ✅ GIẢI PHÁP CUỐI CÙNG

### Bước 1: XÓA CACHE HOÀN TOÀN

Trong trình duyệt (đang mở localhost:3000):

1. Nhấn **F12** → Tab **Application**
2. Bên trái → Click **"Clear storage"** hoặc **"Storage"**
3. Tick chọn TẤT CẢ:
   - [x] Local storage
   - [x] Session storage
   - [x] IndexedDB
   - [x] Cookies
   - [x] Cache storage
   - [x] Service Workers
4. Click **"Clear site data"**
5. **ĐÓNG TAB** trình duyệt

### Bước 2: MỞ TAB MỚI

1. Mở **TAB MỚI** (Ctrl + T)
2. Vào: `http://localhost:3000`
3. **HARD RELOAD:** Nhấn **Ctrl + Shift + R**

### Bước 3: KIỂM TRA CONSOLE

Nhấn F12 → Console

**KHÔNG còn thấy:**
- ❌ `GET http://localhost:4000/api 404`
- ❌ `ERR_BAD_REQUEST`

---

## 🧪 TEST NGAY

1. Click **"Đăng nhập"**
2. Email: `test@example.com`
3. Password: `123456`
4. Click **"Đăng nhập"**

**Kết quả:**
- ✅ Điều hướng về trang Home
- ✅ Hiển thị: "Xin chào, test@example.com!"
- ✅ Role: admin (màu đỏ)
- ✅ 3 sections hiển thị đúng

---

## 🔍 NẾU VẪN LỖI

### Giải pháp 1: Disable Service Worker

Mở `frontend/src/index.js` và kiểm tra:

```javascript
// Nếu có dòng này:
serviceWorker.register();

// Đổi thành:
serviceWorker.unregister();
```

### Giải pháp 2: Restart Frontend SẠCH

```powershell
# Trong terminal frontend (Ctrl+C để dừng)
cd C:\Users\pc\group12-project\frontend

# Xóa cache
Remove-Item -Recurse -Force node_modules\.cache
Remove-Item -Recurse -Force build

# Start lại
npm start
```

### Giải pháp 3: Kiểm tra .env

File `frontend/.env` phải có:
```
REACT_APP_API_BASE_URL=http://localhost:4000/api
```

**SAU ĐÓ PHẢI RESTART** frontend!

### Giải pháp 4: Thêm Health Check Route

Trong `backend/index.js` đã có:
```javascript
app.get("/api/health", (req, res) => res.json({ ok: true }));
```

Test trong Console:
```javascript
fetch('http://localhost:4000/api/health')
  .then(r => r.json())
  .then(d => console.log('✅ Backend OK:', d))
  .catch(e => console.error('❌ Lỗi:', e));
```

**Kết quả mong đợi:**
```
✅ Backend OK: {ok: true}
```

---

## 📊 CHECKLIST CUỐI CÙNG

- [x] Backend chạy port 4000 ✅
- [x] Frontend chạy port 3000 ✅
- [x] Đã sửa 5 files config → port 4000 ✅
- [x] Đã wrap App với AuthProvider ✅
- [ ] **XÓA CACHE TRÌNH DUYỆT** ← LÀM NGAY!
- [ ] Hard reload (Ctrl + Shift + R)
- [ ] Test login thành công

---

**90% lỗi do CACHE! Xóa cache và reload là xong! 🎉**
