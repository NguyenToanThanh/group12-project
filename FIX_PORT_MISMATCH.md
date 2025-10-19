# 🔧 FIX LỖI CONNECTION REFUSED - PORT KHÔNG KHỚP

**Ngày:** 18/10/2025  
**Lỗi:** `ERR_CONNECTION_REFUSED` khi signup/login

---

## ❌ VẤN ĐỀ

### Lỗi trong Console:
```
POST http://localhost:5000/api/signup
net::ERR_CONNECTION_REFUSED
```

### Nguyên nhân:
- **Frontend đang gọi:** `http://localhost:5000`
- **Backend đang chạy:** `http://127.0.0.1:4000`
- **→ PORT KHÔNG KHỚP!** ❌

---

## ✅ ĐÃ FIX

### Thay đổi trong backend/index.js:

```javascript
// ❌ TRƯỚC (SAI)
const PORT = process.env.PORT || 4000;

// ✅ SAU (ĐÚNG)
const PORT = process.env.PORT || 5000;
```

---

## 🚀 CÁCH RESTART BACKEND

### Cách 1: Trong Terminal hiện tại
```powershell
# Nhấn Ctrl + C để stop backend
# Sau đó chạy lại:
cd backend
node index.js
```

### Cách 2: Mở Terminal mới
```powershell
# Terminal mới
cd C:\Users\pc\group12-project\backend
node index.js
```

### Cách 3: Sử dụng npm start
```powershell
cd backend
npm start
```

---

## ✅ KIỂM TRA SAU KHI RESTART

### 1. Xem log trong terminal:
```
Server running on http://127.0.0.1:5000  ← Phải là 5000!
Routes available:
- GET/PUT   /api/profile
- POST      /api/login, /api/signup (demo)
...
```

### 2. Test trong browser:
```
Vào: http://localhost:5000/api/health
Kết quả: {"ok":true}  ✅
```

### 3. Test signup:
```
1. Vào http://localhost:3000/signup
2. Nhập thông tin
3. Click Đăng ký
4. ✅ Phải thành công!
```

---

## 📋 CHECKLIST ĐẦY ĐỦ

### Trước khi test:
- [ ] Backend đã được sửa: `PORT = 5000`
- [ ] Terminal backend đã stop (Ctrl + C)
- [ ] Backend restart lại: `node index.js`
- [ ] Log hiển thị: `http://127.0.0.1:5000` ✅
- [ ] Frontend đang chạy: `npm start`
- [ ] Browser refresh: F5

### Test signup:
- [ ] Vào `/signup`
- [ ] Nhập: Name, Email, Password
- [ ] Network tab: `POST localhost:5000/api/signup`
- [ ] Status: 200 OK ✅
- [ ] Redux: `signup/fulfilled` ✅
- [ ] Message: "Đăng ký thành công!" ✅

### Test login:
- [ ] Vào `/login`
- [ ] Nhập: Email, Password
- [ ] Network tab: `POST localhost:5000/api/login`
- [ ] Status: 200 OK ✅
- [ ] Redux: `login/fulfilled` ✅
- [ ] Redirect: `/profile` ✅
- [ ] Redux Debugger: ✅ Authenticated

---

## 🔍 DEBUG TIPS

### Nếu vẫn lỗi CONNECTION_REFUSED:

#### 1. Kiểm tra backend có chạy không:
```powershell
netstat -ano | findstr :5000
```
Phải có kết quả! Nếu không → backend chưa chạy

#### 2. Kiểm tra port đúng không:
```
Terminal backend phải show:
Server running on http://127.0.0.1:5000
```
Nếu hiện 4000 → chưa save file hoặc chưa restart

#### 3. Kiểm tra frontend gọi đúng port:
```javascript
// frontend/src/redux/authSlice.js
const API_URL = 'http://localhost:5000';  // Phải là 5000
```

#### 4. Kiểm tra CORS:
```javascript
// backend/index.js
origin: ["http://localhost:3000", ...],  // Phải có localhost:3000
```

---

## 🎯 BƯỚC TIẾP THEO

### 1. Stop backend hiện tại:
```
Trong terminal backend:
Nhấn Ctrl + C
```

### 2. Start lại backend:
```powershell
cd backend
node index.js
```

### 3. Xác nhận port 5000:
```
Terminal phải hiển thị:
Server running on http://127.0.0.1:5000
```

### 4. Refresh frontend:
```
Browser: F5
localStorage.clear() (nếu cần)
```

### 5. Test signup:
```
Vào /signup
Nhập thông tin
Click Đăng ký
→ Phải thành công! ✅
```

---

## 📝 TÓM TẮT

**Vấn đề:** 
- Backend chạy port 4000
- Frontend gọi port 5000
- → Connection refused

**Giải pháp:**
- ✅ Sửa backend: `PORT = 5000`
- ✅ Restart backend
- ✅ Test lại signup/login

**Kết quả:**
- ✅ Backend: http://127.0.0.1:5000
- ✅ Frontend: http://localhost:3000
- ✅ Connection OK
- ✅ Signup/Login hoạt động

---

## 🚨 QUAN TRỌNG

**PHẢI RESTART BACKEND!**

Chỉ sửa code mà không restart thì vẫn chạy code cũ (port 4000).

**Cách restart:**
1. Ctrl + C trong terminal backend
2. `node index.js` lại
3. Xác nhận log hiện port 5000

---

**Sau khi restart, test ngay! 🚀**

Good luck! 🎉
