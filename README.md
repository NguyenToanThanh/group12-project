# DỰ ÁN NHÓM 12 – HOẠT ĐỘNG 10

### Môn: Phát triển phần mềm mã nguồn mở

### Chủ đề: Kết hợp Frontend và Backend – Quản lý người dùng

## 1. MÔ TẢ DỰ ÁN

Dự án này là sản phẩm của **Hoạt động 10**, nhằm thực hành kỹ năng:

- Quản lý mã nguồn bằng **Git và GitHub** trong môi trường nhóm.
- Hợp nhất hai phần **frontend (React)** và **backend (Node.js + MongoDB)**.
- Kết nối giao diện React với API Express thông qua **Axios**.
- Triển khai ứng dụng CRUD đơn giản (Create – Read – Delete) với MongoDB Atlas.

**Chức năng chính:**

- Thêm người dùng mới (tên + email)
- Xem danh sách người dùng
- Xóa người dùng khỏi danh sách
- Lưu dữ liệu lên MongoDB Atlas

## 2. CÔNG NGHỆ SỬ DỤNG

### 🔹 Backend

| Thành phần     | Mô tả                                       |
| -------------- | ------------------------------------------- |
| **Node.js**    | Nền tảng chạy JavaScript phía server        |
| **Express.js** | Framework giúp tạo REST API nhanh chóng     |
| **Mongoose**   | ORM để kết nối và thao tác với MongoDB      |
| **dotenv**     | Quản lý biến môi trường (.env)              |
| **CORS**       | Cho phép giao tiếp giữa frontend và backend |

### 🔹 Frontend

| Thành phần                | Mô tả                                  |
| ------------------------- | -------------------------------------- |
| **React.js**              | Thư viện xây dựng giao diện người dùng |
| **Axios**                 | Gửi yêu cầu HTTP đến backend           |
| **Vite / React Scripts**  | Công cụ build và chạy React            |
| **HTML / CSS / JS (ES6)** | Ngôn ngữ nền tảng của giao diện        |

## 3. CẤU TRÚC DỰ ÁN

```
group12-project/
│
├── backend/
│   ├── controllers/        # Xử lý logic API
│   ├── models/             # Định nghĩa schema MongoDB
│   ├── routes/             # Định tuyến API
│   ├── server.js           # Điểm khởi động server
│   ├── .env                # Chứa chuỗi kết nối MongoDB
│   └── package.json
│
├── frontend/
│   ├── src/                # Giao diện React
│   │   ├── AddUser.jsx     # Form thêm user
│   │   ├── UserList.jsx    # Danh sách users
│   │   ├── api.js          # Cấu hình axios
│   │   └── App.js          # Gốc React app
│   ├── public/
│   ├── .env                # Đường dẫn API backend
│   └── package.json
│
└── README.md
```

## 4. HƯỚNG DẪN CHẠY DỰ ÁN

### Backend

```bash
cd backend
npm install
npm start
```

Nếu thành công, bạn sẽ thấy:

```
MongoDB connected
Server running on port 3000
```

### Frontend

```bash
cd ../frontend
npm install
npm start
```

## 5. PHÂN CÔNG CÔNG VIỆC

| Thành viên            | Nhiệm vụ                                                          | Ghi chú                                  |
| --------------------- | ----------------------------------------------------------------- | ---------------------------------------- |
| **Nguyễn Thanh Toàn** | Trưởng nhóm, quản lý Git, xử lý xung đột merge, hoàn thiện README | Hoàn thiện rebase, tích hợp toàn bộ repo |
| **Minh Dũng**         | Xây dựng backend (Express, MongoDB), viết API CRUD                | Test kết nối MongoDB Atlas               |
| **Minh Thiên**        | Xây dựng frontend (React, Axios, UI cơ bản)                       | Gọi API và hiển thị danh sách user       |

## 6. KẾT QUẢ HOẠT ĐỘNG

- Merge thành công `backend` + `frontend` vào `main`
- Xử lý rebase sạch sẽ, không còn xung đột
- Kết nối MongoDB Atlas hoạt động
- Giao diện thêm / xoá user thành công
- Đẩy toàn bộ repo lên GitHub: https://github.com/NguyenToanThanh/group12-project.git

## 7. KẾT LUẬN

Hoạt động 10 giúp nhóm củng cố các kỹ năng:

- Sử dụng Git trong nhóm, hiểu merge/rebase/xử lý conflict.
- Tổ chức project gồm backend + frontend.
- Thực hành kết nối cơ sở dữ liệu thật (MongoDB Atlas).
- Đạt được quy trình làm việc nhóm hiệu quả và chuyên nghiệp.
