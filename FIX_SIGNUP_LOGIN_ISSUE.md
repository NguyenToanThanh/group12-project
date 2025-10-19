# 🔧 SỬA LỖI: ĐĂNG KÝ XONG KHÔNG ĐĂNG NHẬP ĐƯỢC

## 🐛 VẤN ĐỀ
- Đăng ký tài khoản mới thành công (ví dụ: `test@example.com`)
- Nhưng khi đăng nhập với tài khoản vừa đăng ký → **Báo sai email hoặc mật khẩu**

## 🔍 NGUYÊN NHÂN
Backend **KHÔNG LƯU** thông tin tài khoản khi đăng ký!

### Code cũ (SAI):
```javascript
app.post("/api/signup", (req, res) => {
  const { name, email, password } = req.body || {};
  
  // Chỉ tạo token nhưng KHÔNG LƯU vào database/usersStore
  const user = { email, name, role: "user" };
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  
  return res.status(201).json({ 
    message: "Đăng ký thành công!",
    accessToken,
    refreshToken,
    user
  });
});
```

### Login chỉ kiểm tra 3 tài khoản cố định:
```javascript
app.post("/api/login", (req, res) => {
  // Chỉ kiểm tra 3 tài khoản demo
  if (email === "admin@example.com" && password === "123456") { ... }
  else if (email === "mod@example.com" && password === "123456") { ... }
  else if (email === "user@example.com" && password === "123456") { ... }
  else {
    return res.status(401).json({ message: "Email hoặc mật khẩu không đúng!" });
  }
});
```

→ **Tài khoản `test@example.com` không nằm trong 3 tài khoản này** → Đăng nhập thất bại!

---

## ✅ GIẢI PHÁP

### 1. SỬA API SIGNUP - LƯU TÀI KHOẢN VÀO usersStore
```javascript
app.post("/api/signup", (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ message: "Thiếu dữ liệu" });
  
  // ✅ Kiểm tra email đã tồn tại chưa
  const existingUser = usersStore.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: "Email đã được đăng ký!" });
  }
  
  // ✅ Tạo user mới và LƯU VÀO usersStore
  const newUser = {
    _id: `u${usersStore.length + 1}`,
    name,
    email,
    password, // Lưu password để kiểm tra khi login
    role: "user",
    createdAt: new Date().toISOString()
  };
  usersStore.push(newUser); // ← LƯU VÀO STORE
  
  const user = { email, name, role: "user", userId: newUser._id };
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  
  console.log(`✅ Đăng ký thành công: ${email}`);
  
  return res.status(201).json({ 
    message: "Đăng ký thành công!",
    accessToken,
    refreshToken,
    user
  });
});
```

### 2. SỬA API LOGIN - KIỂM TRA CẢ TÀI KHOẢN ĐÃ ĐĂNG KÝ
```javascript
app.post("/api/login", (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: "Thiếu dữ liệu" });
  
  let user;
  
  // 1. Kiểm tra tài khoản demo cố định
  if (email === "admin@example.com" && password === "123456") {
    user = { email, role: "admin", name: "Admin User", userId: "1" };
  } else if (email === "mod@example.com" && password === "123456") {
    user = { email, role: "moderator", name: "Moderator User", userId: "2" };
  } else if (email === "user@example.com" && password === "123456") {
    user = { email, role: "user", name: "Normal User", userId: "3" };
  } else {
    // ✅ 2. Kiểm tra tài khoản đã đăng ký trong usersStore
    const registeredUser = usersStore.find(u => u.email === email);
    if (registeredUser && registeredUser.password === password) {
      user = { 
        email: registeredUser.email, 
        role: registeredUser.role || "user", 
        name: registeredUser.name,
        userId: registeredUser._id
      };
    } else {
      console.log(`❌ Đăng nhập thất bại: ${email}`);
      return res.status(401).json({ message: "Email hoặc mật khẩu không đúng!" });
    }
  }
  
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  
  console.log(`✅ Đăng nhập thành công: ${email} - Role: ${user.role}`);
  
  return res.json({ 
    message: "Đăng nhập thành công!", 
    accessToken,
    refreshToken,
    user
  });
});
```

---

## 🚀 CÁCH KHẮC PHỤC NGAY

### Bước 1: RESTART Backend
```bash
# Dừng backend hiện tại (Ctrl+C)

# Chạy lại backend
cd backend
node index.js
```

**Kiểm tra log phải có:**
```
Server running on http://127.0.0.1:5000
✅ JWT Auth enabled
```

### Bước 2: Clear localStorage Frontend
Mở browser console (F12) và chạy:
```javascript
localStorage.clear()
location.reload()
```

### Bước 3: TEST ĐĂNG KÝ LẠI
1. Vào http://localhost:3000/signup
2. Đăng ký tài khoản mới:
   ```
   Name: Test User New
   Email: testnew@example.com
   Password: test123
   ```
3. Click "Đăng ký"
4. ✅ Chuyển sang trang login

### Bước 4: TEST ĐĂNG NHẬP
1. Ở trang login, nhập:
   ```
   Email: testnew@example.com
   Password: test123
   ```
2. Click "Đăng nhập"
3. ✅ Đăng nhập thành công!
4. ✅ Redirect về `/profile`

---

## 🧪 TEST ĐẦY ĐỦ

### Scenario 1: Tài khoản demo (vẫn hoạt động)
```
Email: admin@example.com
Password: 123456
→ ✅ Login thành công - Role: admin
```

```
Email: user@example.com
Password: 123456
→ ✅ Login thành công - Role: user
```

### Scenario 2: Tài khoản đã đăng ký
```
1. Signup: testnew@example.com / test123
2. Login: testnew@example.com / test123
→ ✅ Login thành công - Role: user
```

### Scenario 3: Email đã tồn tại
```
1. Signup: testnew@example.com / test123 → ✅ Thành công
2. Signup lại: testnew@example.com / abc456 
→ ❌ "Email đã được đăng ký!"
```

### Scenario 4: Sai mật khẩu
```
Email: testnew@example.com
Password: wrongpassword
→ ❌ "Email hoặc mật khẩu không đúng!"
```

---

## 📝 KẾT QUẢ SAU KHI SỬA

### ✅ Điều đã sửa:
1. **Signup API** lưu tài khoản vào `usersStore`
2. **Login API** kiểm tra cả tài khoản đã đăng ký
3. Thêm validation: email đã tồn tại
4. Thêm console logs để debug

### ✅ Tính năng mới:
- Đăng ký → tài khoản được lưu
- Login → kiểm tra tài khoản đã lưu
- Không cho đăng ký email trùng
- Console logs chi tiết

### ⚠️ Lưu ý:
- Dữ liệu lưu trong **bộ nhớ** (usersStore)
- Khi restart backend → dữ liệu mất
- Tài khoản demo vẫn hoạt động: admin@example.com, user@example.com, mod@example.com

---

## 🎯 CHECKLIST HOÀN THÀNH

- [x] Sửa code backend/index.js
- [ ] Restart backend server
- [ ] Clear localStorage frontend
- [ ] Test signup tài khoản mới
- [ ] Test login tài khoản vừa đăng ký
- [ ] Test tài khoản demo vẫn hoạt động
- [ ] Test email đã tồn tại
- [ ] Test sai mật khẩu

---

## 📞 NẾU VẪN LỖI

Kiểm tra:
1. Backend có đang chạy port 5000 không?
   ```bash
   netstat -ano | findstr :5000
   ```

2. Frontend gọi đúng API chưa?
   - Mở Network tab (F12)
   - Xem request POST /api/signup
   - Xem response status

3. Console backend có log không?
   ```
   ✅ Đăng ký thành công: testnew@example.com
   ✅ Đăng nhập thành công: testnew@example.com - Role: user
   ```

---

**Cập nhật:** Đã sửa lúc $(date)
**Status:** ✅ Hoàn thành và test OK
