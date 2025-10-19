# 🎯 HƯỚNG DẪN TEST 3 ROLES

## 📋 Danh sách tài khoản test

Backend đã được cấu hình với 3 tài khoản tương ứng 3 roles:

### 1️⃣ **Admin** (Quyền cao nhất - thấy 3 sections)
```
Email: admin@example.com
Password: <bất kỳ> (backend không check password)
```
**Kết quả:** 
- ✅ Chức năng của tất cả user (viền xanh)
- ⚡ Moderator Tools (viền cam)
- 👑 Admin Panel (viền đỏ)

---

### 2️⃣ **Moderator** (Quyền trung bình - thấy 2 sections)
```
Email: mod@example.com
Password: <bất kỳ>
```
**Kết quả:**
- ✅ Chức năng của tất cả user (viền xanh)
- ⚡ Moderator Tools (viền cam)
- 🔒 Admin Panel (MỜ - không có quyền)

---

### 3️⃣ **User** (Quyền thấp nhất - chỉ thấy 1 section)
```
Email: user@example.com
Password: <bất kỳ>
```
**Kết quả:**
- ✅ Chức năng của tất cả user (viền xanh)
- 🔒 Moderator Tools (MỜ - không có quyền)
- 🔒 Admin Panel (MỜ - không có quyền)

---

## 🔄 CÁCH TEST

### Bước 1: Đăng xuất (nếu đang đăng nhập)
- Click nút **"Đăng xuất"** màu đỏ ở trên cùng

### Bước 2: Đăng nhập với từng tài khoản
1. Click **"Đăng nhập"** trên navbar
2. Nhập email (theo bảng trên)
3. Password: gõ bất kỳ (ví dụ: `123`)
4. Click **"Đăng nhập"**

### Bước 3: Quan sát UI
- Kiểm tra **Role** hiển thị:
  - `admin` → màu ĐỎ
  - `moderator` → màu CAM
  - `user` → màu XANH LÁ
- Đếm số section có viền đậm (không mờ):
  - Admin: 3 sections
  - Moderator: 2 sections
  - User: 1 section

### Bước 4: Chụp ảnh
Chụp màn hình **ĐẦY ĐỦ TRANG** cho mỗi role để nộp bài

---

## 📸 YÊU CẦU SCREENSHOTS

Cần **3 ảnh** chụp toàn bộ trang:

1. **admin-view.png**: Email `admin@example.com`, hiển thị 3 sections đậm
2. **moderator-view.png**: Email `mod@example.com`, hiển thị 2 sections đậm + 1 mờ
3. **user-view.png**: Email `user@example.com`, hiển thị 1 section đậm + 2 mờ

---

## ✅ XÁC NHẬN HOẠT ĐỘNG 2 THÀNH CÔNG

Khi thấy:
- ✅ 3 role hiển thị UI **KHÁC NHAU**
- ✅ Role "user" **KHÔNG THẤY** Moderator Tools và Admin Panel (chỉ thấy mờ)
- ✅ Role "moderator" **KHÔNG THẤY** Admin Panel (mờ)
- ✅ Role "admin" **THẤY TẤT CẢ** 3 sections

→ **Hoạt động 2 - RBAC Frontend hoàn thành 100%!** 🎉
