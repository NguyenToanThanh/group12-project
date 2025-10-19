# 🔐 HOẠT ĐỘNG 4 - FORGOT & RESET PASSWORD (Frontend SV2)

## ✅ ĐÃ HOÀN THÀNH

### Backend (Đã có sẵn):
- ✅ API `POST /api/forgot-password` (nhận email, trả token)
- ✅ API `POST /api/reset-password` (nhận token + password mới)
- ✅ Token hết hạn sau 15 phút
- ✅ Lưu token trong Map (demo - in-memory)

### Frontend (Vừa tạo):
- ✅ Component `ForgotPassword.jsx` - Form nhập email
- ✅ Component `ResetPassword.jsx` - Form đổi password với token
- ✅ Validate email, password (min 6 ký tự), confirm password
- ✅ Auto redirect về login sau reset thành công
- ✅ Link "Quên mật khẩu?" ở trang Login
- ✅ Routes `/forgot-password` và `/reset-password`

---

## 🎯 LUỒNG HOẠT ĐỘNG

### 1️⃣ **User quên mật khẩu**
```
Login Page → Click "🔐 Quên mật khẩu?" → Forgot Password Page
```

### 2️⃣ **Nhập email**
```
Nhập email → Click "📧 Gửi yêu cầu" → Backend tạo token
```

### 3️⃣ **Nhận token (Demo)**
```
Frontend hiển thị token (trong thực tế sẽ gửi qua email)
Console log: "🔑 Reset Token: abc123..."
```

### 4️⃣ **Reset password**
```
Click "➡️ Đến trang Reset Password" → Auto fill token vào form
Nhập password mới → Confirm password → Click "✅ Đặt lại mật khẩu"
```

### 5️⃣ **Auto redirect**
```
Message "✅ Đổi mật khẩu thành công" → Chuyển về /login sau 2 giây
```

---

## 🧪 CÁCH TEST

### Test 1: Forgot Password

#### Bước 1: Vào trang Forgot Password
- URL: **http://localhost:3000/forgot-password**
- Hoặc: Login → Click "🔐 Quên mật khẩu?"

#### Bước 2: Nhập email hợp lệ
```
Email: admin@example.com
Click: "📧 Gửi yêu cầu"
```

**Kết quả:**
- ✅ Message: "Đã tạo token reset (demo)..."
- 🔑 Hiển thị token trong box màu vàng
- 📋 Console log: `🔑 Reset Token: ...`
- ➡️ Nút "Đến trang Reset Password"

#### Bước 3: Copy token
- Token format: `abc123def456...`
- Hoặc click nút xanh để auto chuyển

---

### Test 2: Reset Password

#### Bước 1: Vào trang Reset Password
- Từ Forgot Password → Click nút xanh
- Hoặc trực tiếp: **http://localhost:3000/reset-password?token=YOUR_TOKEN**

#### Bước 2: Nhập thông tin
```
Token: (Đã auto-fill từ URL hoặc paste thủ công)
Mật khẩu mới: 123456
Xác nhận mật khẩu: 123456
```

#### Bước 3: Submit
Click **"✅ Đặt lại mật khẩu"**

**Kết quả:**
- ✅ Message: "Đổi mật khẩu thành công"
- "Đang chuyển về trang đăng nhập..."
- Auto redirect sau 2 giây

#### Bước 4: Đăng nhập lại
- URL tự chuyển về `/login`
- Nhập email + password mới
- Login thành công!

---

### Test 3: Validate & Error Handling

#### Test email không hợp lệ
```
Input: abc@
Kết quả: "❌ Email không hợp lệ"
```

#### Test password quá ngắn
```
Input: 12345 (5 ký tự)
Kết quả: "❌ Mật khẩu phải có ít nhất 6 ký tự"
```

#### Test confirm password không khớp
```
Password: 123456
Confirm: 654321
Kết quả: "❌ Mật khẩu xác nhận không khớp"
```

#### Test token hết hạn
```
Chờ 16 phút sau khi nhận token → Submit
Kết quả: "❌ Token đã hết hạn"
```

#### Test token không tồn tại
```
Input token: abc123xyz (random)
Kết quả: "❌ Token không hợp lệ"
```

---

## 📸 YÊU CẦU SCREENSHOTS

Chụp **5 ảnh** để nộp bài:

### 1. **Trang Forgot Password (Trước submit)**
- Form nhập email
- Nút "Gửi yêu cầu"

### 2. **Sau nhận token**
- Message "✅ Đã tạo token..."
- Box màu vàng hiển thị token
- Nút "Đến trang Reset Password"

### 3. **Console log token**
- F12 → Console
- Log: `🔑 Reset Token: ...`

### 4. **Trang Reset Password**
- Token đã fill vào ô input
- Form nhập password mới
- Nút "Đặt lại mật khẩu"

### 5. **Sau reset thành công**
- Message "✅ Đổi mật khẩu thành công"
- "Đang chuyển về trang đăng nhập..."

---

## 🔧 KIỂM TRA KỸ THUẬT

### Backend Terminal Logs
```bash
[FORGOT] email: admin@example.com token: abc123def456...
```

### Frontend Console Logs
```javascript
🔑 Reset Token: abc123def456...
✅ Reset password thành công
```

### Network Tab (F12 → Network)
```
POST /api/forgot-password
  Request: { "email": "admin@example.com" }
  Response: { "message": "...", "token": "..." }

POST /api/reset-password
  Request: { "token": "abc123...", "password": "123456" }
  Response: { "message": "Đổi mật khẩu thành công" }
```

---

## ⚠️ LƯU Ý QUAN TRỌNG

### Token expiry
- ⏰ Token chỉ có hiệu lực **15 phút**
- Sau 15 phút phải request token mới

### Security (Production)
Hiện tại là **DEMO**, thiếu:
- ❌ Gửi email thật (cần Nodemailer + Gmail SMTP)
- ❌ Hash password (cần bcrypt)
- ❌ Lưu token vào database
- ❌ Rate limiting (chống spam request)

### Frontend không cần sửa
- ✅ Khi SV3 Backend thêm Nodemailer, frontend vẫn hoạt động bình thường
- ✅ Frontend chỉ gửi email và nhận token, không quan tâm backend gửi email thế nào

---

## 🌐 URL ROUTES

| Route | Component | Mô tả |
|-------|-----------|-------|
| `/forgot-password` | ForgotPassword.jsx | Form nhập email |
| `/reset-password` | ResetPassword.jsx | Form đổi password |
| `/reset-password?token=abc123` | ResetPassword.jsx | Auto-fill token |
| `/login` | Login.jsx | Có link "Quên mật khẩu?" |

---

## ✅ HOÀN THÀNH HOẠT ĐỘNG 4

Khi:
- ✅ Nhập email → Nhận token
- ✅ Token hiển thị đúng trong UI và Console
- ✅ Reset password với token → Thành công
- ✅ Auto redirect về login
- ✅ Validate đầy đủ (email, password, confirm)
- ✅ Error handling (token hết hạn, không hợp lệ)
- ✅ Có 5 screenshots

→ **Frontend Member 2 hoàn thành Hoạt động 4!** 🎉

---

## 🚀 NEXT STEPS (Cho Backend Team)

- **SV3:** Cấu hình Nodemailer + Gmail SMTP
- **SV3:** Gửi email thật với link reset
- **SV1:** Hash password với bcrypt
- **SV3:** Lưu token vào MongoDB thay vì Map
- **Backend:** Thêm rate limiting (max 5 requests/15 phút/IP)
