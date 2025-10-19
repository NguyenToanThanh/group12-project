# ✅ HOÀN THÀNH HOẠT ĐỘNG 2 - RBAC FRONTEND

## 🎉 TÓM TẮT

Bạn đã hoàn thành **Hoạt động 2 - SV2 (Frontend hiển thị theo role)**!

**Đã làm:**
✅ AuthContext decode JWT → lấy role  
✅ RoleGate component điều kiện hiển thị  
✅ Home.jsx UI khác nhau cho 3 roles  
✅ Login.jsx tích hợp AuthContext  

---

## 🚀 HƯỚNG DẪN TEST NGAY

### Bước 1: Kiểm tra servers đang chạy

- Backend: http://localhost:4000 ✅ (Đã chạy)
- Frontend: http://localhost:3000 (Cần kiểm tra)

### Bước 2: Mở React App

Mở trình duyệt: **http://localhost:3000**

### Bước 3: Đăng nhập

Email: `test@example.com`  
Password: `123456`

### Bước 4: Kiểm tra UI

Sau khi đăng nhập, bạn sẽ thấy:

**Role: admin** (màu đỏ)

```
┌─────────────────────────────────────┐
│ Xin chào, test@example.com!         │
│ Role: admin                         │
│ [Đăng xuất]                         │
└─────────────────────────────────────┘

┌─ ✅ Chức năng của tất cả user ──────┐
│ [Xem Profile]                       │
└─────────────────────────────────────┘

┌─ ⚡ Moderator Tools ─────────────────┐
│ [Quản lý bài viết]                  │
└─────────────────────────────────────┘

┌─ 👑 Admin Panel ────────────────────┐
│ [Quản lý người dùng] → /admin/users │
└─────────────────────────────────────┘
```

---

## 🧪 TEST CÁC ROLE KHÁC NHAU

### Test 1: USER role

Mở Console (F12) và chạy:

```javascript
// Giả lập user role
const fakeUserToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE2OTczNjIwMDAsImV4cCI6OTk5OTk5OTk5OX0.EXAMPLE";

// Decode để xem
const payload = JSON.parse(atob(fakeUserToken.split('.')[1]));
console.log('Role:', payload.role); // "user"

// Để test, sửa backend/index.js:
// const user = { email, role: "user", name: "User Test" };
```

**Kết quả:** Chỉ thấy section "✅ Chức năng của tất cả user"

### Test 2: MODERATOR role

Sửa `backend/index.js` dòng 91:

```javascript
const user = { email, role: "moderator", name: "Moderator User" };
```

Restart backend, đăng nhập lại.

**Kết quả:** Thấy User features + Moderator Tools

### Test 3: ADMIN role (Mặc định)

Backend mặc định trả `role: "admin"`.

**Kết quả:** Thấy tất cả sections

---

## 📸 CHỤP SCREENSHOTS CHO BÁO CÁO

### Screenshot 1: Admin view
- Đăng nhập với admin
- Chụp toàn bộ trang Home
- Lưu: `screenshots/hoat-dong-2-admin-view.png`

### Screenshot 2: Moderator view
- Đổi role thành moderator
- Chụp trang Home
- Lưu: `screenshots/hoat-dong-2-moderator-view.png`

### Screenshot 3: User view
- Đổi role thành user
- Chụp trang Home
- Lưu: `screenshots/hoat-dong-2-user-view.png`

### Screenshot 4: Code RoleGate
- Mở `RoleGate.jsx`
- Chụp full code
- Lưu: `screenshots/hoat-dong-2-role-gate-code.png`

---

## 🎬 QUAY VIDEO DEMO (Bonus)

### Script:

1. **Intro (5s):**
   > "Xin chào, em demo Hoạt động 2 - RBAC Frontend"

2. **Login (10s):**
   > "Em đăng nhập với role admin"
   - Nhập email/password
   - Click đăng nhập

3. **Admin view (15s):**
   > "Với admin, em thấy tất cả 3 sections: User, Moderator, và Admin Panel"
   - Di chuột qua các sections
   - Click nút "Quản lý người dùng"

4. **Moderator view (15s):**
   > "Bây giờ em đổi thành moderator role"
   - Logout
   - Sửa backend role
   - Login lại
   > "Moderator thấy User + Moderator Tools, nhưng Admin Panel bị khóa"

5. **User view (15s):**
   > "Cuối cùng, user role chỉ thấy section cơ bản"
   - Logout, đổi role user, login lại

6. **Code walkthrough (30s):**
   - Mở `RoleGate.jsx`
   > "Em dùng component RoleGate để kiểm tra role"
   - Mở `Home.jsx`
   > "Trong Home, em dùng RoleGate 2 lần cho moderator và admin"

7. **Outro (10s):**
   > "Vậy là em đã hoàn thành Hoạt động 2. Cảm ơn thầy/cô!"

**Thời lượng:** ~2 phút

---

## 📝 GIT COMMIT

```bash
# Kiểm tra files đã thay đổi
git status

# Add files
git add frontend/src/context/AuthContext.jsx
git add frontend/src/components/RoleGate.jsx
git add frontend/src/pages/Home.jsx
git add frontend/src/pages/Login.jsx
git add HOAT_DONG_2_RBAC_FRONTEND.md

# Commit
git commit -m "Hoàn thành Hoạt động 2 - Frontend RBAC

- AuthContext: Decode JWT để lấy role
- RoleGate: Component điều kiện hiển thị UI
- Home: Hiển thị khác nhau cho user/moderator/admin
- Login: Tích hợp AuthContext

Test cases:
✅ Admin thấy tất cả features
✅ Moderator thấy User + Moderator tools
✅ User chỉ thấy features cơ bản"

# Push
git push origin frontend
```

Sau đó tạo Pull Request:
- Title: `[SV2] Hoạt động 2 - Advanced RBAC Frontend`
- Description: Đính kèm screenshots và link video (nếu có)

---

## 🔗 NEXT STEPS

Bạn đã hoàn thành:
- ✅ Hoạt động 1: Refresh Token & Session Management
- ✅ Hoạt động 2: RBAC Frontend (SV2)

**Hoạt động tiếp theo:**
- Hoạt động 3: Admin quản lý users (nếu bạn là SV3)
- Hoặc chuẩn bị báo cáo và demo cho giảng viên

---

**🎉 CHÚC MỪNG BẠN ĐÃ HOÀN THÀNH!** 🎉
