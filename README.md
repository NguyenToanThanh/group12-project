# 🎓 DỰ ÁN NHÓM 12 – User Management System

## 📋 Tổng quan

Dự án **User Management System** với đầy đủ tính năng nâng cao:

- ✅ JWT Authentication (Access Token + Refresh Token)
- ✅ Advanced RBAC (3 roles: User, Moderator, Admin)
- ✅ Avatar Upload (Cloudinary + Sharp resize)
- ✅ Forgot Password & Reset Password (Email thật)
- ✅ Activity Logging & Rate Limiting
- ✅ Frontend React với Redux & Protected Routes

---

## 🎯 Hoàn thành 7 Hoạt động

### ✅ Hoạt động 1: Refresh Token & Session Management

- API `/api/auth/refresh` - Làm mới Access Token
- Access Token: 15 phút, Refresh Token: 7 ngày
- Lưu Refresh Token trong database
- Revoke token khi logout

### ✅ Hoạt động 2: Advanced RBAC

- 3 roles: `user`, `moderator`, `admin`
- Middleware `checkRole(...roles)` linh hoạt
- API quản lý users cho Admin/Moderator

### ✅ Hoạt động 3: Upload Avatar

- Upload với Multer
- Resize với Sharp (500x500px)
- Lưu trên Cloudinary
- Tự động xóa avatar cũ

### ✅ Hoạt động 4: Forgot Password & Reset Password

- Gửi email thật với Nodemailer
- Token reset có thời hạn 30 phút
- API reset password an toàn

### ✅ Hoạt động 5: Activity Logging & Rate Limiting

- Middleware `logActivity` tự động ghi log
- Rate limiting: 5 login attempts/phút
- API xem logs cho Admin và User

### ✅ Hoạt động 6: Frontend Redux & Protected Routes

- Cấu trúc sẵn sàng tích hợp Redux
- JWT authentication flow
- Role-based routing

### ✅ Hoạt động 7: Tổng hợp & Merge

- Tất cả tính năng đã tích hợp
- Documentation đầy đủ
- Ready for deployment

---

## 🛠 Tech Stack

### Backend

| Công nghệ              | Phiên bản   | Mục đích           |
| ---------------------- | ----------- | ------------------ |
| **Node.js**            | >= 18.0.0   | Runtime JavaScript |
| **Express.js**         | 5.1.0       | Web framework      |
| **MongoDB**            | 8.18.3      | Database           |
| **Mongoose**           | 8.18.3      | ODM                |
| **JWT**                | 9.0.2       | Authentication     |
| **Bcryptjs**           | 2.4.3       | Password hashing   |
| **Cloudinary**         | 1.41.3      | Image storage      |
| **Sharp**              | 0.33.5      | Image processing   |
| **Nodemailer**         | 7.0.10      | Email sending      |
| **Multer**             | 1.4.5-lts.1 | File upload        |
| **Express-rate-limit** | 8.1.0       | Rate limiting      |

### Frontend

| Công nghệ         | Mục đích                 |
| ----------------- | ------------------------ |
| **React.js**      | UI library               |
| **Redux Toolkit** | State management (ready) |
| **React Router**  | Routing                  |
| **Axios**         | HTTP client              |

---

## 📁 Cấu trúc Project

```
backend/
├── controllers/
│   └── userController.js      # Auth, Profile, Admin, Logs
├── middlewares/
│   ├── auth.js                # JWT auth, checkRole
│   ├── logActivity.js         # Activity logging
│   ├── rateLimit.js           # Rate limiting
│   └── upload.js              # Multer config
├── Models/
│   ├── User.js                # User schema (với avatar, resetToken)
│   ├── refreshToken.model.js # Refresh token schema
│   └── Log.js                 # Activity log schema
├── routes/
│   ├── auth.js                # Auth routes
│   └── user.js                # User routes
├── utils/
│   ├── cloudinary.js          # Cloudinary config
│   └── sendEmail.js           # Email config
├── .env                       # Environment variables
├── server.js                  # Entry point
└── package.json

frontend/
├── src/
│   ├── pages/                 # React pages
│   ├── components/            # React components
│   ├── store/                 # Redux store (ready)
│   └── App.js
└── package.json
```

---

## 🚀 Hướng dẫn chạy

### 1. Clone repository

```bash
git clone https://github.com/NguyenToanThanh/group12-project.git
cd group12-project/backend/group12-project
```

### 2. Cài đặt dependencies

```bash
cd backend
npm install
```

### 3. Cấu hình .env

Tạo file `.env` trong thư mục `backend/`:

```env
# Server
PORT=4000

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_key_here

# Cloudinary (đăng ký tại cloudinary.com)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

**Lưu ý Gmail App Password:**

1. Vào Google Account → Security
2. Bật 2-Step Verification
3. Tạo App Password cho "Mail"
4. Copy password vào `SMTP_PASS`

### 4. Chạy Backend

```bash
npm start
# hoặc development mode với nodemon
npm run dev
```

Server chạy tại: `http://localhost:4000`

### 5. Chạy Frontend (optional)

```bash
cd ../frontend
npm install
npm start
```

Frontend chạy tại: `http://localhost:3000`

---

## 📖 API Documentation

Xem chi tiết tại: [API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md)

### Quick Reference

#### Authentication

```bash
POST /api/auth/signup        # Đăng ký
POST /api/auth/login         # Đăng nhập
POST /api/auth/refresh       # Làm mới token
POST /api/auth/logout        # Đăng xuất
POST /api/auth/forgot-password  # Quên mật khẩu
POST /api/auth/reset-password/:token  # Đặt lại mật khẩu
```

#### User Profile

```bash
GET  /api/users/profile      # Xem profile
PUT  /api/users/profile      # Cập nhật profile
POST /api/users/upload-avatar  # Upload avatar
DELETE /api/users/avatar     # Xóa avatar
```

#### Activity Logs

```bash
GET /api/users/logs/me       # Xem logs của mình
GET /api/users/logs          # Xem tất cả logs (Admin)
```

#### Admin/Moderator

```bash
GET    /api/users            # Xem tất cả users
POST   /api/users            # Tạo user mới
PUT    /api/users/:id/role   # Cập nhật role
DELETE /api/users/:id        # Xóa user
```

---

## 🧪 Testing với Postman

### 1. Import Collection

Tải file [Postman Collection](./postman/Group12-API.postman_collection.json)

### 2. Test Flow

1. **Đăng ký:** POST `/api/auth/signup`
2. **Đăng nhập:** POST `/api/auth/login` → Lưu `accessToken`
3. **Upload avatar:** POST `/api/users/upload-avatar`
4. **Xem profile:** GET `/api/users/profile`
5. **Test refresh:** POST `/api/auth/refresh`
6. **Xem logs:** GET `/api/users/logs/me`

### 3. Tạo Admin account

```bash
POST /api/auth/signup
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "Admin@123",
  "role": "admin"
}
```

Sau đó có thể dùng admin token để:

- Xem tất cả users: GET `/api/users`
- Xem tất cả logs: GET `/api/users/logs`
- Quản lý roles

---

## 🔐 Security Features

✅ **JWT với Refresh Token**

- Access Token: 15 phút (short-lived)
- Refresh Token: 7 ngày (stored in DB)
- Auto-refresh khi token hết hạn

✅ **Password Security**

- Bcrypt hashing (cost factor 10)
- Password reset với token có thời hạn
- Không lưu plain password

✅ **Rate Limiting**

- Login: 5 attempts/phút
- Chống brute force attacks

✅ **Activity Logging**

- Ghi log mọi hoạt động quan trọng
- Tracking: IP, User Agent, Timestamp
- Audit trail cho Admin

✅ **Role-Based Access Control**

- 3 levels: User → Moderator → Admin
- Middleware linh hoạt `checkRole(...roles)`
- Fine-grained permissions

✅ **File Upload Security**

- Validate file type (images only)
- Resize với Sharp (tránh upload file quá lớn)
- Upload lên Cloudinary (không lưu local)

---

## 🌐 Deploy lên Render

### 1. Tạo Web Service

1. Vào [render.com](https://render.com) → New → Web Service
2. Connect GitHub repo: `group12-project`
3. Cấu hình:
   - **Name:** `group12-backend`
   - **Root Directory:** `backend/group12-project/backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Branch:** `main`

### 2. Thêm Environment Variables

Trong Render Dashboard → Environment:

```
MONGO_URI=mongodb+srv://...
JWT_SECRET=...
JWT_REFRESH_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
SMTP_USER=...
SMTP_PASS=...
```

### 3. Deploy

Click **Create Web Service** → Render tự động deploy

URL: `https://group12-backend.onrender.com`

---

## 🎓 Team Members

| Thành viên | Vai trò            | Công việc chính                             |
| ---------- | ------------------ | ------------------------------------------- |
| **SV1**    | Backend Developer  | API development, Middleware, Authentication |
| **SV2**    | Frontend Developer | React UI, Redux, Protected Routes           |
| **SV3**    | Database & Testing | MongoDB Schema, Testing, Documentation      |

---

## 📝 Git Workflow

### Nhánh chính

```bash
main              # Production-ready code
feature/rbac      # Hiện tại đang làm việc
```

### Commit & Push

```bash
git add .
git commit -m "fix: resolve package.json merge conflict and add health endpoint"
git push origin feature/rbac
```

### Merge vào main

```bash
git checkout main
git merge feature/rbac
git push origin main
```

---

## 📚 Tài liệu tham khảo

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT.io](https://jwt.io/)
- [Cloudinary Docs](https://cloudinary.com/documentation)
- [Sharp Image Processing](https://sharp.pixelplumbing.com/)
- [Nodemailer Guide](https://nodemailer.com/)

---

## 🐛 Troubleshooting

### Lỗi "Cannot GET /health"

**Giải pháp:** Đã thêm route `/health` trong `server.js`

### Lỗi "EJSONPARSE" khi deploy

**Nguyên nhân:** Merge conflict trong `package.json`
**Giải pháp:** Đã fix conflict và validate JSON

### Lỗi "Invalid token"

**Nguyên nhân:** Token hết hạn hoặc sai
**Giải pháp:** Dùng `/api/auth/refresh` để làm mới token

### Upload avatar failed

**Kiểm tra:**

1. Cloudinary credentials trong `.env`
2. File size không quá lớn
3. File format hợp lệ (jpg, png, gif)

---

## 📄 License

ISC

---

## 📞 Support

Nếu gặp vấn đề, vui lòng:

1. Check logs: `npm start` xem error message
2. Kiểm tra `.env` đã cấu hình đúng
3. Xem API Documentation
4. Contact team members

---

**Last Updated:** October 26, 2025  
**Version:** 1.0.0  
**Status:** ✅ Production Ready

| **Nguyễn Thành Toàn** | Backend | Xây dựng API người dùng, xử lý CRUD |
| **Đoàn Nhật Thiên** | Frontend | Thiết kế giao diện React, kết nối API |
| **Trịnh Minh Dũng** | Database | Cấu hình MongoDB Atlas, Model `User.js` |

---

- Xây dựng các API CRUD người dùng (`/api/users`).
- Kết nối MongoDB qua `mongoose`.
- Tạo và cấu hình `server.js`, `userController.js`, `userRoutes.js`.

- Tạo giao diện React.
- Gọi API backend bằng `Axios`.
- Hiển thị danh sách người dùng và xử lý thêm / xóa.

- Tạo model `User.js` gồm: `username`, `email`, `password`, `role`.
- Lưu dữ liệu trên MongoDB Atlas.
- Kiểm tra thao tác thêm / xóa / đọc dữ liệu.

---

- Kết nối thành công giữa **Frontend – Backend – Database**.
- CRUD hoạt động tốt trên MongoDB Atlas.
- Hoàn thiện quy trình **Git Workflow**, merge code nhóm thành công.

- Vai trò: Backend (Toàn)
- Vai trò: Frontend (Thiên)
- Vai trò: Database (Dũng)
