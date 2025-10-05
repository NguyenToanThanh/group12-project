# DỰ ÁN NHÓM 12 – HOẠT ĐỘNG 10



---


Dự án này là sản phẩm của **Hoạt động 10**, nhằm thực hành kỹ năng:

- Quản lý mã nguồn bằng **Git và GitHub** trong môi trường nhóm.
- Hợp nhất hai phần **frontend (React)** và **backend (Node.js + MongoDB)**.
- Kết nối giao diện React với API Express thông qua **Axios**.
- Triển khai ứng dụng CRUD đơn giản (Create – Read – Delete) với MongoDB Atlas.


- Thêm người dùng mới (tên + email)
- Xem danh sách người dùng
- Xóa người dùng khỏi danh sách
- Lưu dữ liệu lên MongoDB Atlas

---


| Thành phần     | Mô tả                                       |
| -------------- | ------------------------------------------- |
| **Node.js**    | Nền tảng chạy JavaScript phía server        |
| **Express.js** | Framework giúp tạo REST API nhanh chóng     |
| **Mongoose**   | ORM để kết nối và thao tác với MongoDB      |
| **dotenv**     | Quản lý biến môi trường (.env)              |
| **CORS**       | Cho phép giao tiếp giữa frontend và backend |



| Thành phần                | Mô tả                                  |
| ------------------------- | -------------------------------------- |
| **React.js**              | Thư viện xây dựng giao diện người dùng |
| **Axios**                 | Gửi yêu cầu HTTP đến backend           |
| **Vite / React Scripts**  | Công cụ build và chạy React            |
| **HTML / CSS / JS (ES6)** | Ngôn ngữ nền tảng của giao diện        |

---



---



| Họ tên             | Vai trò     | Công việc chính |
|--------------------|--------------|-----------------|
| **Nguyễn Thành Toàn** | Backend  | Xây dựng API người dùng, xử lý CRUD |
| **Đoàn Nhật Thiên**    | Frontend | Thiết kế giao diện React, kết nối API |
| **Trịnh Minh Dũng**    | Database | Cấu hình MongoDB Atlas, Model `User.js` |

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
