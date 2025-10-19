# 📊 HOẠT ĐỘNG 5 - USER ACTIVITY LOGGING & RATE LIMITING (Frontend SV2)

## ✅ ĐÃ HOÀN THÀNH

### Backend Features:
- ✅ Activity logging system (in-memory)
- ✅ Rate limiting login (max 5 attempts / 15 minutes)
- ✅ Log actions: LOGIN_SUCCESS, LOGIN_BLOCKED, AVATAR_UPLOAD, PASSWORD_RESET
- ✅ API `/api/activity-logs` với filter (action, userId, limit)

### Frontend Features:
- ✅ Component `ActivityLogs.jsx` - Dashboard hiển thị logs
- ✅ Filter logs theo Action Type, User ID
- ✅ Table view với icon màu sắc
- ✅ Real-time display
- ✅ Route `/admin/logs`

---

## 🎯 CHỨC NĂNG

### 1️⃣ **Activity Logging**
Ghi lại mọi hoạt động quan trọng:
```javascript
{
  id: 1,
  userId: "1",
  action: "LOGIN_SUCCESS",
  details: { email: "admin@example.com", role: "admin", ip: "::1" },
  timestamp: "2025-10-17T10:30:45.123Z",
  ip: "::1"
}
```

**Actions được log:**
- `LOGIN_SUCCESS` ✅ - Đăng nhập thành công
- `LOGIN_BLOCKED` 🚫 - Bị chặn do quá nhiều lần thử
- `AVATAR_UPLOAD` 📸 - Upload ảnh đại diện
- `PASSWORD_RESET` 🔑 - Đặt lại mật khẩu
- `LOGOUT` 👋 - Đăng xuất

---

### 2️⃣ **Rate Limiting**
Chống brute force login:
- **Max:** 5 attempts / 15 phút / email
- **Block time:** 15 phút
- **Reset:** Tự động reset sau khi đăng nhập thành công

**Flow:**
```
Attempt 1-5: OK ✅
Attempt 6+: HTTP 429 🚫
Message: "Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau X phút."
```

---

## 🧪 CÁCH TEST

### Test 1: Activity Logs Dashboard

1. **Đăng nhập:**
   ```
   http://localhost:3000/login
   Email: admin@example.com
   Password: 123
   ```

2. **Vào Activity Logs:**
   ```
   http://localhost:3000/admin/logs
   Hoặc click "Activity Logs" trên navbar
   ```

3. **Xem logs:**
   - Danh sách logs hiển thị dạng bảng
   - Mỗi action có icon và màu riêng
   - Timestamp format VN

4. **Test filter:**
   - **Action Type:** Chọn "LOGIN_SUCCESS"
   - Click "🔍 Search"
   - Chỉ thấy logs LOGIN_SUCCESS

   - **User ID:** Nhập "1"
   - Click "🔍 Search"
   - Chỉ thấy logs của user ID 1

   - Click "🔄 Reset" để xóa filter

---

### Test 2: Rate Limiting

1. **Mở tab Incognito hoặc Private:**
   ```
   Ctrl + Shift + N (Chrome)
   Ctrl + Shift + P (Firefox)
   ```

2. **Thử login sai 6 lần:**
   ```
   Email: test@wrong.com
   Password: wrongpass
   Submit x6 lần
   ```

3. **Lần thứ 6:**
   - ❌ HTTP Status: 429
   - Message: "Quá nhiều lần đăng nhập thất bại..."
   - Thời gian chờ: ~15 phút

4. **Xem logs:**
   - Vào `/admin/logs`
   - Filter: Action Type = "LOGIN_BLOCKED"
   - Thấy log với details: `{ reason: "Rate limit exceeded", ip: "..." }`

5. **Backend terminal:**
   ```
   📝 [LOG] test@wrong.com - LOGIN_BLOCKED - ...
   ```

---

### Test 3: Upload Activity Log

1. **Upload avatar:**
   ```
   http://localhost:3000/upload-avatar
   Chọn ảnh → Upload
   ```

2. **Xem logs:**
   ```
   /admin/logs
   Filter: AVATAR_UPLOAD
   ```

3. **Details hiển thị:**
   ```json
   {
     "filename": "1729161234567-123456789.jpg",
     "size": 45678,
     "ip": "::1"
   }
   ```

---

## 📸 YÊU CẦU SCREENSHOTS

Chụp **5 ảnh** để nộp bài:

### 1. **Activity Logs - Tổng quan**
- Table hiển thị logs đầy đủ
- Có nhiều loại action khác nhau
- Timestamp, User ID, IP

### 2. **Filter theo Action**
- Dropdown chọn "LOGIN_SUCCESS"
- Kết quả chỉ hiển thị login success

### 3. **Filter theo User ID**
- Input: "1"
- Kết quả chỉ hiển thị logs của user 1

### 4. **Rate Limiting - Login Blocked**
- Login form hiển thị message 429
- "Quá nhiều lần đăng nhập thất bại..."

### 5. **Backend Terminal Logs**
- Console hiển thị:
  ```
  📝 [LOG] 1 - LOGIN_SUCCESS - ...
  📝 [LOG] test@wrong.com - LOGIN_BLOCKED - ...
  📝 [LOG] authenticated-user - AVATAR_UPLOAD - ...
  ```

---

## 🔧 BACKEND API

### GET `/api/activity-logs`

**Query Parameters:**
```
?action=LOGIN_SUCCESS    // Filter by action type
&userId=1                // Filter by user ID
&limit=50                // Max results (default: 50)
```

**Response:**
```json
{
  "total": 245,
  "filtered": 23,
  "logs": [
    {
      "id": 245,
      "userId": "1",
      "action": "LOGIN_SUCCESS",
      "details": {
        "email": "admin@example.com",
        "role": "admin",
        "ip": "::1"
      },
      "timestamp": "2025-10-17T10:30:45.123Z",
      "ip": "::1"
    }
  ]
}
```

---

## 🎨 UI DESIGN

### Color Scheme:
- **LOGIN_SUCCESS** ✅: Green (#4CAF50)
- **LOGIN_BLOCKED** 🚫: Red (#f44336)
- **AVATAR_UPLOAD** 📸: Blue (#2196F3)
- **PASSWORD_RESET** 🔑: Orange (#FF9800)
- **LOGOUT** 👋: Gray (#9E9E9E)

### Table Layout:
```
| ID | Time              | User ID | Action          | Details            | IP    |
|----|-------------------|---------|-----------------|-------------------|-------|
| 1  | 17/10/2025 10:30  | 1       | ✅ LOGIN_SUCCESS | {"email":"..."} | ::1   |
```

---

## ⚠️ SECURITY NOTES

### Current Implementation (Demo):
- ❌ In-memory storage (mất khi restart)
- ❌ Không có authentication middleware
- ❌ Admin role không được check

### Production Requirements:
- ✅ Lưu logs vào MongoDB
- ✅ Middleware check admin role
- ✅ Redis cho rate limiting
- ✅ IP geolocation
- ✅ Email alerts cho suspicious activity

---

## 🚀 TESTING CHECKLIST

- [ ] Đăng nhập thành công → Thấy log LOGIN_SUCCESS
- [ ] Login sai 6 lần → Bị block, thấy log LOGIN_BLOCKED
- [ ] Upload avatar → Thấy log AVATAR_UPLOAD
- [ ] Xem Activity Logs page → Table hiển thị đúng
- [ ] Filter by Action → Kết quả chính xác
- [ ] Filter by User ID → Kết quả chính xác
- [ ] Reset filter → Hiển thị tất cả
- [ ] Backend terminal → Logs hiển thị real-time

---

## ✅ HOÀN THÀNH HOẠT ĐỘNG 5

Khi:
- ✅ Activity Logs page hiển thị logs
- ✅ Filter hoạt động chính xác
- ✅ Rate limiting chặn login sau 5 attempts
- ✅ Backend logs hiển thị trong terminal
- ✅ Có 5 screenshots đầy đủ

→ **Frontend Member 2 hoàn thành Hoạt động 5!** 🎉

---

## 📞 TROUBLESHOOTING

### Logs trống?
- Thực hiện vài action (login, upload) để tạo logs
- Refresh page

### Rate limiting không hoạt động?
- Kiểm tra email khác nhau
- Mỗi email có counter riêng

### Backend không log?
- Check terminal có message `📝 [LOG]` không
- Restart backend nếu cần

---

## 🔗 RELATED DOCS

- HOAT_DONG_2_RBAC_FRONTEND.md
- HOAT_DONG_3_UPLOAD_AVATAR_FRONTEND.md
- HOAT_DONG_4_FORGOT_RESET_PASSWORD_FRONTEND.md
- TONG_KET_FRONTEND_SV2.md
