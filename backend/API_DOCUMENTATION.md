# 📚 API Documentation - Group 12 Project

## 🎯 Tổng quan 7 hoạt động đã hoàn thành

### ✅ Hoạt động 1 - Refresh Token & Session Management

- API `/api/auth/refresh` - Làm mới Access Token
- Access Token: 15 phút
- Refresh Token: 7 ngày (lưu trong database)
- Revoke token khi logout

### ✅ Hoạt động 2 - Advanced RBAC

- 3 roles: `user`, `moderator`, `admin`
- Middleware `checkRole(...roles)` - Kiểm tra nhiều roles
- API quản lý users cho Admin/Moderator

### ✅ Hoạt động 3 - Upload Avatar

- Upload ảnh với Multer
- Resize với Sharp (500x500px)
- Lưu trên Cloudinary
- Xóa avatar cũ tự động

### ✅ Hoạt động 4 - Forgot Password & Reset Password

- Gửi email với Nodemailer
- Token reset 30 phút
- API reset password với token

### ✅ Hoạt động 5 - Activity Logging & Rate Limiting

- Middleware `logActivity` - Ghi log tự động
- Rate limiting cho login (5 requests/phút)
- API xem logs cho Admin và User

### ✅ Hoạt động 6 - Frontend Redux & Protected Routes

- Cấu trúc sẵn sàng cho Redux integration
- JWT authentication
- Role-based routing

### ✅ Hoạt động 7 - Tổng hợp & Merge

- Tất cả tính năng đã tích hợp
- Documentation đầy đủ

---

## 🔐 Authentication Endpoints

### 1. Đăng ký (Signup)

```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"  // optional: user | moderator | admin
}
```

**Response:**

```json
{
  "id": "60d5ec49f1b2c72b8c8e4f1a",
  "email": "john@example.com"
}
```

### 2. Đăng nhập (Login)

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "60d5ec49f1b2c72b8c8e4f1a",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Rate Limiting:** Tối đa 5 lần / phút

### 3. Làm mới Access Token (Refresh Token)

```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "60d5ec49f1b2c72b8c8e4f1a",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### 4. Đăng xuất (Logout)

```http
POST /api/auth/logout
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response:**

```json
{
  "message": "Logged out successfully"
}
```

### 5. Quên mật khẩu (Forgot Password)

```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

**Response:**

```json
{
  "message": "Reset token generated",
  "token": "abc123xyz..."
}
```

### 6. Đặt lại mật khẩu (Reset Password)

```http
POST /api/auth/reset-password/:token
Content-Type: application/json

{
  "password": "newPassword123"
}
```

**Response:**

```json
{
  "message": "Password updated"
}
```

---

## 👤 User Profile Endpoints

### 7. Xem profile của mình

```http
GET /api/users/profile
Authorization: Bearer {accessToken}
```

**Response:**

```json
{
  "_id": "60d5ec49f1b2c72b8c8e4f1a",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "avatarUrl": "https://res.cloudinary.com/...",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 8. Cập nhật profile

```http
PUT /api/users/profile
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "name": "John Smith",
  "currentPassword": "oldPassword",  // required if changing password/email
  "password": "newPassword123",       // optional
  "email": "newEmail@example.com"    // optional
}
```

---

## 📷 Avatar Upload Endpoints

### 9. Upload avatar

```http
POST /api/users/upload-avatar
Authorization: Bearer {accessToken}
Content-Type: multipart/form-data

file: [binary image file]
```

**Supported formats:** JPEG, JPG, PNG, GIF
**Max size:** Depends on Cloudinary settings
**Auto resize:** 500x500px with Sharp

**Response:**

```json
{
  "message": "Tải ảnh thành công",
  "avatar": {
    "url": "https://res.cloudinary.com/.../avatars/user_123_1234567890.jpg",
    "publicId": "avatars/user_123_1234567890",
    "width": 500,
    "height": 500
  }
}
```

### 10. Xóa avatar

```http
DELETE /api/users/avatar
Authorization: Bearer {accessToken}
```

**Response:**

```json
{
  "message": "Đã xoá avatar",
  "userId": "60d5ec49f1b2c72b8c8e4f1a"
}
```

---

## 📊 Activity Logs Endpoints

### 11. Xem logs của chính mình

```http
GET /api/users/logs/me?page=1&limit=20
Authorization: Bearer {accessToken}
```

**Response:**

```json
{
  "logs": [
    {
      "_id": "60d5ec49f1b2c72b8c8e4f1b",
      "userId": "60d5ec49f1b2c72b8c8e4f1a",
      "action": "login",
      "ip": "192.168.1.1",
      "userAgent": "Mozilla/5.0...",
      "timestamp": "2024-01-01T10:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  }
}
```

### 12. Xem tất cả logs (Admin only)

```http
GET /api/users/logs?page=1&limit=50&userId=xxx&action=login
Authorization: Bearer {accessToken}
```

**Query Parameters:**

- `page` (optional): Trang hiện tại (default: 1)
- `limit` (optional): Số logs mỗi trang (default: 50)
- `userId` (optional): Lọc theo user ID
- `action` (optional): Lọc theo action (login, logout, signup, etc.)

**Response:**

```json
{
  "logs": [
    {
      "_id": "60d5ec49f1b2c72b8c8e4f1b",
      "userId": {
        "_id": "60d5ec49f1b2c72b8c8e4f1a",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user"
      },
      "action": "login",
      "ip": "192.168.1.1",
      "userAgent": "Mozilla/5.0...",
      "timestamp": "2024-01-01T10:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 50,
    "totalPages": 3
  }
}
```

---

## 👥 Admin/Moderator Endpoints

### 13. Xem tất cả users (Admin/Moderator)

```http
GET /api/users
Authorization: Bearer {accessToken}
```

**Required Role:** `admin` hoặc `moderator`

**Response:**

```json
{
  "users": [
    {
      "_id": "60d5ec49f1b2c72b8c8e4f1a",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "avatarUrl": "https://...",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 14. Tạo user mới (Admin only)

```http
POST /api/users
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",  // optional, default: "123456"
  "role": "moderator"          // optional, default: "user"
}
```

**Response:**

```json
{
  "message": "Tạo user thành công",
  "user": {
    "id": "60d5ec49f1b2c72b8c8e4f1c",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "moderator"
  }
}
```

### 15. Cập nhật role user (Admin only)

```http
PUT /api/users/:id/role
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "role": "moderator"  // user | moderator | admin
}
```

**Response:**

```json
{
  "message": "Cập nhật quyền thành công",
  "user": {
    "_id": "60d5ec49f1b2c72b8c8e4f1a",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "moderator"
  }
}
```

### 16. Xóa user (Admin only)

```http
DELETE /api/users/:id
Authorization: Bearer {accessToken}
```

**Response:**

```json
{
  "message": "Xoá người dùng thành công"
}
```

---

## 🔒 Role-Based Access Control (RBAC)

| Role        | Permissions                                                                |
| ----------- | -------------------------------------------------------------------------- |
| `user`      | - Xem/sửa profile riêng<br>- Upload/xóa avatar<br>- Xem logs riêng         |
| `moderator` | **user** +<br>- Xem danh sách users                                        |
| `admin`     | **moderator** +<br>- Tạo/xóa users<br>- Cập nhật role<br>- Xem tất cả logs |

---

## 🔧 Middleware Details

### 1. `auth` - Authentication Middleware

Kiểm tra JWT token từ header `Authorization: Bearer {token}`

### 2. `adminOnly` - Admin Only Middleware

Chỉ cho phép users có `role === "admin"`

### 3. `checkRole(...roles)` - Flexible Role Middleware

Cho phép kiểm tra nhiều roles:

```javascript
router.get("/users", auth, checkRole("admin", "moderator"), getUsers);
```

### 4. `logActivity` - Activity Logging Middleware

Tự động log mọi request vào database

### 5. `loginLimiter` - Rate Limiting Middleware

Giới hạn login: 5 requests / phút

---

## 🌐 Health Check

```http
GET /health
```

**Response:**

```json
{
  "status": "ok",
  "message": "Server is running",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

## 📝 Environment Variables

```env
# Server
PORT=4000

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

---

## 🧪 Testing với Postman

### 1. **Đăng ký user mới**

POST `/api/auth/signup` → Lưu `accessToken` và `refreshToken`

### 2. **Đăng nhập**

POST `/api/auth/login` → Lấy tokens

### 3. **Upload avatar**

POST `/api/users/upload-avatar`

- Headers: `Authorization: Bearer {accessToken}`
- Body: form-data, key=`file`, value=[chọn ảnh]

### 4. **Test refresh token**

POST `/api/auth/refresh`

- Body: `{ "refreshToken": "..." }`

### 5. **Xem logs (Admin)**

Đầu tiên cần tạo admin account:

```bash
# Trong MongoDB hoặc tạo qua API
POST /api/users
{
  "name": "Admin",
  "email": "admin@example.com",
  "password": "admin123",
  "role": "admin"
}
```

GET `/api/users/logs` với admin token

---

## 🚀 Getting Started

### 1. Cài đặt dependencies

```bash
cd backend
npm install
```

### 2. Cấu hình `.env`

Copy `.env.example` → `.env` và điền thông tin

### 3. Chạy server

```bash
npm start
# hoặc development mode
npm run dev
```

### 4. Test API

- URL: `http://localhost:4000`
- Health check: `http://localhost:4000/health`

---

## 📦 Dependencies

```json
{
  "bcryptjs": "^2.4.3",
  "cloudinary": "^1.41.3",
  "cors": "^2.8.5",
  "dotenv": "^16.4.5",
  "express": "^5.1.0",
  "express-rate-limit": "^8.1.0",
  "jsonwebtoken": "^9.0.2",
  "mongoose": "^8.18.3",
  "morgan": "^1.10.0",
  "multer": "^1.4.5-lts.1",
  "nodemailer": "^7.0.10",
  "sharp": "^0.33.5"
}
```

---

## 🎓 Team Members

- **SV1**: Backend API development
- **SV2**: Frontend React + Redux
- **SV3**: Database schema + Testing

---

## 📄 License

ISC

---

**Last Updated:** October 26, 2025
**Version:** 1.0.0
