# 🔐 Tài Khoản Test - RBAC Demo

## 📋 Danh Sách Tài Khoản

Backend đã có sẵn **3 tài khoản demo** với các vai trò khác nhau:

### 1. 👑 **Admin Account**
```
Email: admin@example.com
Password: 123456
Role: admin
```
**Quyền hạn:**
- ✅ Xem Profile
- ✅ Upload Avatar
- ✅ Xem Dashboard
- ✅ **Admin Panel** (Quản lý users)
- ✅ **Moderator Tools**
- ✅ **Activity Logs**

---

### 2. 🛡️ **Moderator Account**
```
Email: mod@example.com
Password: 123456
Role: moderator
```
**Quyền hạn:**
- ✅ Xem Profile
- ✅ Upload Avatar
- ✅ Xem Dashboard
- ✅ **Moderator Tools** (Duyệt nội dung)
- ❌ Admin Panel (không có quyền)

---

### 3. 👤 **User Account**
```
Email: user@example.com
Password: 123456
Role: user
```
**Quyền hạn:**
- ✅ Xem Profile
- ✅ Upload Avatar
- ✅ Xem Dashboard
- ❌ Moderator Tools (không có quyền)
- ❌ Admin Panel (không có quyền)

---

## 🧪 Cách Test RBAC

### Bước 1: Đăng nhập với Admin
1. Vào http://localhost:3000/login
2. Nhập email: `admin@example.com`
3. Nhập password: `123456`
4. Nhấn "Đăng nhập"
5. **Kiểm tra**: Sẽ thấy cả Admin Panel và Moderator Tools

### Bước 2: Đăng nhập với Moderator
1. Đăng xuất (Logout)
2. Login với `mod@example.com` / `123456`
3. **Kiểm tra**: Chỉ thấy Moderator Tools, KHÔNG thấy Admin Panel

### Bước 3: Đăng nhập với User
1. Đăng xuất (Logout)
2. Login với `user@example.com` / `123456`
3. **Kiểm tra**: KHÔNG thấy Admin Panel và Moderator Tools

---

## 📊 So Sánh Quyền Hạn

| Tính năng | Admin | Moderator | User |
|-----------|-------|-----------|------|
| Profile | ✅ | ✅ | ✅ |
| Upload Avatar | ✅ | ✅ | ✅ |
| Dashboard | ✅ | ✅ | ✅ |
| Moderator Tools | ✅ | ✅ | ❌ |
| Admin Panel | ✅ | ❌ | ❌ |
| Activity Logs | ✅ | ❌ | ❌ |
| Delete Users | ✅ | ❌ | ❌ |

---

## 🎯 Test Cases Cần Chạy

### Test 1: Admin Full Access ✅
- Login với admin@example.com
- Xem Profile → OK
- Xem Admin Panel → OK
- Xem Moderator Tools → OK

### Test 2: Moderator Limited Access ✅
- Login với mod@example.com
- Xem Profile → OK
- Xem Moderator Tools → OK
- Xem Admin Panel → ❌ "Bạn không có quyền"

### Test 3: User Basic Access ✅
- Login với user@example.com
- Xem Profile → OK
- Xem Moderator Tools → ❌ "Bạn không có quyền"
- Xem Admin Panel → ❌ "Bạn không có quyền"

---

## 🔄 Tạo Tài Khoản Mới

Nếu muốn tạo tài khoản mới qua Signup:
1. Vào `/signup`
2. Đăng ký tài khoản mới
3. **Lưu ý**: Tài khoản mới sẽ có role = `"user"` (mặc định)

Để thay đổi role sang admin/moderator, cần sửa trực tiếp trong backend code (usersStore).

---

## 🚨 Rate Limiting

Backend có **rate limiting** để chống brute force:
- **Giới hạn**: 5 lần đăng nhập sai / 15 phút
- **Nếu vượt quá**: Bị block 15 phút
- **Test**: Thử login sai 6 lần liên tiếp để thấy thông báo block

---

## 📸 Screenshot Cần Chụp Cho Demo

1. **Login thành công với Admin** → Hiển thị Admin Panel + Moderator Tools
2. **Login với Moderator** → Chỉ hiển thị Moderator Tools (Admin Panel bị lock)
3. **Login với User** → Không hiển thị cả 2 (chỉ có basic features)
4. **Forgot Password** → Nhập email, nhận token
5. **Reset Password** → Nhập token và password mới
6. **Upload Avatar** → Upload ảnh thành công
7. **Activity Logs (Admin)** → Hiển thị lịch sử hoạt động

---

## 🎥 Video Demo Nên Bao Gồm

1. Đăng nhập với 3 role khác nhau (Admin, Moderator, User)
2. So sánh quyền hạn của từng role
3. Test Forgot Password và Reset Password
4. Upload avatar
5. Xem Activity Logs (Admin only)
6. Test rate limiting (login sai nhiều lần)

---

**Chúc bạn demo thành công! 🎉**
