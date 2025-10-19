# Hoạt động 2 - Advanced RBAC (Role-Based Access Control)

**Thành viên: SV2 - Frontend**  
**Nhiệm vụ:** Frontend hiển thị chức năng khác nhau theo role

---

## 📋 YÊU CẦU ĐÃ HOÀN THÀNH

### ✅ SV2 - Frontend theo Role

**File đã tạo/sửa:**
1. `frontend/src/context/AuthContext.jsx` - Decode JWT để lấy role
2. `frontend/src/components/RoleGate.jsx` - Component điều kiện hiển thị theo role
3. `frontend/src/pages/Home.jsx` - Trang chủ hiển thị UI khác nhau theo role
4. `frontend/src/pages/Login.jsx` - Tích hợp AuthContext

---

## 🏗️ KIẾN TRÚC RBAC

### 1. AuthContext - Quản lý Authentication & Role

```javascript
// Decode JWT để lấy thông tin user
function decodeJWT(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(jsonPayload);
}

// State: { email, role, userId }
const { user, login, logout, isAuthenticated } = useAuth();
```

### 2. RoleGate Component - Điều kiện hiển thị

```jsx
<RoleGate
  allowed={['admin', 'moderator']}
  userRole={user?.role}
  fallback={<div>Bạn không có quyền</div>}
>
  <button>Moderator Tools</button>
</RoleGate>
```

**Props:**
- `allowed`: Mảng các role được phép (`['admin']`, `['moderator', 'admin']`)
- `userRole`: Role hiện tại của user
- `children`: UI hiển thị khi có quyền
- `fallback`: UI hiển thị khi KHÔNG có quyền (optional)

### 3. Home.jsx - UI theo 3 Roles

| Role | Chức năng thấy được |
|------|-------------------|
| **user** | ✅ Xem Profile |
| **moderator** | ✅ Xem Profile<br>⚡ Moderator Tools |
| **admin** | ✅ Xem Profile<br>⚡ Moderator Tools<br>👑 Admin Panel (Quản lý users) |

---

## 🧪 HƯỚNG DẪN TEST

### Test Case 1: Login với role USER

1. Mở `http://localhost:3000/login`
2. Đăng nhập với:
   - Email: `test@example.com`
   - Password: `123456`
3. **Kết quả mong đợi:**
   - Role hiển thị: `user` (màu xanh lá)
   - Thấy: "✅ Chức năng của tất cả user"
   - KHÔNG thấy: Moderator Tools & Admin Panel (chỉ hiển thị khung mờ "Bạn không có quyền")

### Test Case 2: Login với role MODERATOR

**Cách tạo moderator:**
Mở Console (F12) và chạy:
```javascript
// Đăng nhập với backend mock
fetch('http://localhost:4000/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'moderator@test.com', password: '123456' })
})
.then(res => res.json())
.then(data => {
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
  location.reload();
});
```

**Hoặc sửa backend/index.js:**
```javascript
app.post("/api/login", (req, res) => {
  const user = { email, role: "moderator", name: "Moderator User" }; // Đổi role
  // ...
});
```

**Kết quả mong đợi:**
- Role hiển thị: `moderator` (màu cam)
- Thấy: User features + Moderator Tools
- KHÔNG thấy: Admin Panel

### Test Case 3: Login với role ADMIN

Backend mặc định trả role `admin`.

**Kết quả mong đợi:**
- Role hiển thị: `admin` (màu đỏ)
- Thấy: TẤT CẢ chức năng (User + Moderator + Admin)
- Nút "Quản lý người dùng" → Link đến `/admin/users`

---

## 📸 DEMO SCRIPT (Trình bày cho giảng viên)

### Bước 1: Giới thiệu kiến trúc

> "Chào thầy/cô, em là thành viên 2 frontend, phụ trách phần hiển thị UI theo role.
>
> Em đã xây dựng hệ thống RBAC với 3 thành phần chính:
> 1. **AuthContext** - Decode JWT để lấy role từ token
> 2. **RoleGate** - Component điều kiện render theo role
> 3. **Home** - Trang chủ hiển thị khác nhau cho 3 roles"

### Bước 2: Demo thực tế

**2.1. Đăng nhập với USER:**
```
"Bây giờ em sẽ đăng nhập với role user. Sau khi đăng nhập, role hiển thị màu xanh lá.
User chỉ thấy 1 section: 'Chức năng của tất cả user'.
Moderator Tools và Admin Panel bị ẩn đi, hiển thị thông báo 'Bạn không có quyền'."
```

**2.2. Đổi role thành MODERATOR:**
```
"Em sẽ đổi role thành moderator. Moderator role hiển thị màu cam.
Bây giờ thấy thêm section 'Moderator Tools' màu cam, nhưng Admin Panel vẫn bị khóa."
```

**2.3. Đổi role thành ADMIN:**
```
"Cuối cùng, với admin role màu đỏ, em thấy tất cả các sections.
Có thêm 'Admin Panel' với nút 'Quản lý người dùng' dẫn đến trang quản trị."
```

### Bước 3: Giải thích code

**Mở `RoleGate.jsx`:**
```
"Component RoleGate nhận prop 'allowed' là mảng các role được phép.
Nếu userRole nằm trong mảng allowed → hiển thị children.
Nếu không → hiển thị fallback hoặc null."
```

**Mở `Home.jsx`:**
```
"Trong trang Home, em dùng RoleGate 3 lần:
- Section 1: Không dùng RoleGate → tất cả thấy
- Section 2: RoleGate cho ['moderator', 'admin']
- Section 3: RoleGate chỉ cho ['admin']"
```

---

## 🎯 CHECKLIST HOÀN THÀNH

- [x] AuthContext decode JWT và lưu role
- [x] RoleGate component với props allowed/fallback
- [x] Home.jsx hiển thị 3 sections theo role
- [x] Test với 3 roles: user, moderator, admin
- [x] UI khác nhau rõ ràng (màu sắc, nội dung)

---

## 📦 GIT WORKFLOW

```bash
# Tạo branch mới
git checkout -b feature/rbac-frontend

# Add files
git add frontend/src/context/AuthContext.jsx
git add frontend/src/components/RoleGate.jsx
git add frontend/src/pages/Home.jsx
git add frontend/src/pages/Login.jsx

# Commit
git commit -m "Hoàn thành Hoạt động 2 - Frontend RBAC theo role"

# Push
git push origin feature/rbac-frontend
```

Sau đó tạo Pull Request trên GitHub với:
- Title: `[SV2] Hoạt động 2 - Advanced RBAC Frontend`
- Description: Link đến file này + screenshots/video demo

---

## 🔗 LIÊN KẾT

- Hoạt động 1 (Refresh Token): `HOAT_DONG_1_REFRESH_TOKEN.md`
- Backend API: `http://localhost:4000/api`
- Frontend: `http://localhost:3000`

---

**Ngày hoàn thành:** 16/10/2025  
**Thành viên:** SV2 - Frontend Team
