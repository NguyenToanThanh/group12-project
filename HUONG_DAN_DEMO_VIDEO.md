# 🎥 HƯỚNG DẪN DEMO & GHI HÌNH - HOẠT ĐỘNG 6
# Frontend Redux & Protected Routes

---

## 📋 CHUẨN BỊ TRƯỚC KHI GHI HÌNH

### 1. Công cụ cần thiết:
- ✅ OBS Studio / Loom / Zoom (để ghi màn hình)
- ✅ Browser: Chrome/Edge (cài Redux DevTools Extension)
- ✅ VS Code
- ✅ PowerPoint/Slides (optional - để intro)

### 2. Kiểm tra trước:
```bash
# Backend chạy được
cd backend
node index.js
# → Server running on port 5000

# Frontend chạy được
cd frontend
npm start
# → React app on port 3000
```

### 3. Clear dữ liệu test cũ:
- Mở Developer Console (F12)
- Console: `localStorage.clear()`
- Refresh page

---

## 🎬 KỊCH BẢN DEMO (10-15 phút)

### PHẦN 1: GIỚI THIỆU (1-2 phút)

**Nói:**
> "Xin chào! Hôm nay em sẽ demo Hoạt động 6 - Frontend Redux và Protected Routes.
> 
> Mục tiêu của hoạt động này là:
> 1. Quản lý state nâng cao với Redux Toolkit
> 2. Bảo vệ các route với Protected Routes
> 3. Triển khai role-based access control
> 
> Em là thành viên Frontend số 2, chịu trách nhiệm phần Redux và Protected Routes."

**Hiển thị màn hình:**
- Mở file `BAO_CAO_HOAT_DONG_6.md`
- Scroll qua các phần để show tổng quan
- Mở cấu trúc thư mục trong VS Code

---

### PHẦN 2: KIẾN TRÚC REDUX (2-3 phút)

**Hiển thị code:**

#### 2.1. Redux Store
```javascript
// Mở file: src/redux/store.js
```

**Nói:**
> "Đầu tiên, em đã setup Redux store với configureStore từ Redux Toolkit.
> Store này quản lý toàn bộ authentication state của ứng dụng."

**Điểm nổi bật:**
- Point vào `configureStore`
- Point vào `authReducer`

#### 2.2. Auth Slice
```javascript
// Mở file: src/redux/authSlice.js
```

**Nói:**
> "Auth slice chứa:
> - State: user, accessToken, refreshToken, isAuthenticated, loading, error
> - Async thunks: loginUser, signupUser, refreshAccessToken
> - Reducers: logout, clearError, setCredentials
> 
> Đặc biệt, em có implement JWT decoder để extract user info từ token,
> và auto-save/load tokens từ localStorage để persist authentication."

**Scroll và highlight:**
- Initial state structure
- Async thunk `loginUser`
- `decodeJWT` function
- `extraReducers` section

#### 2.3. Provider Integration
```javascript
// Mở file: src/index.js
```

**Nói:**
> "Redux store được wrap toàn bộ app với Provider component,
> cho phép tất cả components truy cập Redux state."

---

### PHẦN 3: PROTECTED ROUTES (2 phút)

```javascript
// Mở file: src/components/ProtectedRoute.jsx
```

**Nói:**
> "ProtectedRoute component kiểm tra authentication từ Redux state.
> Nếu chưa đăng nhập → redirect về /login
> Nếu có requiredRole mà không khớp → redirect về trang chủ
> 
> Đây là cơ chế bảo vệ các route quan trọng trong app."

**Show code:**
- `useSelector` để lấy auth state
- Logic check `isAuthenticated`
- Logic check `requiredRole`
- `Navigate` component

---

### PHẦN 4: DEMO THỰC TẾ (6-8 phút)

#### 4.1. Khởi động ứng dụng (30 giây)

**Nói:**
> "Bây giờ em sẽ demo thực tế. Backend đang chạy trên port 5000,
> Frontend trên port 3000."

**Hiển thị:**
- Terminal backend đang chạy
- Terminal frontend đang chạy
- Mở browser http://localhost:3000

---

#### 4.2. Test Public Access (1 phút)

**Actions:**
1. Vào trang chủ http://localhost:3000
2. Mở Redux DevTools (F12 → Redux tab)
3. Mở Console, chạy:
   ```javascript
   localStorage.getItem('accessToken')  // → null
   ```

**Nói:**
> "Khi chưa đăng nhập:
> - Redux state: isAuthenticated = false
> - LocalStorage không có tokens
> - Trang chủ hiển thị nút 'Đăng nhập'"

**Demo Protected Routes:**
4. Thử truy cập `/profile` → Redirect về `/login` ✅
5. Thử truy cập `/admin` → Redirect về `/login` ✅

**Nói:**
> "Protected routes tự động redirect về login khi chưa authenticate."

---

#### 4.3. Test Signup Flow (1 phút)

**Actions:**
1. Click "Đăng ký" hoặc vào `/signup`
2. Nhập thông tin:
   ```
   Name: Test User
   Email: test@example.com
   Password: test123
   ```
3. Click "Đăng ký"

**Hiển thị Redux DevTools:**
- Action: `auth/signup/pending`
- Action: `auth/signup/fulfilled`

**Nói:**
> "Đăng ký thành công! Redux dispatch action signup,
> và tự động chuyển về trang login."

---

#### 4.4. Test Login Flow (1.5 phút)

**Actions:**
1. Ở trang login, nhập:
   ```
   Email: test@example.com
   Password: test123
   ```
2. Click "Đăng nhập"

**Show trong Redux DevTools:**
3. Actions flow:
   - `auth/login/pending`
   - `auth/login/fulfilled`
4. State changes:
   - `isAuthenticated: true`
   - `user: { email, role, userId }`
   - `accessToken: "jwt..."`

**Show trong Console:**
5. Chạy:
   ```javascript
   localStorage.getItem('accessToken')  // → có token
   localStorage.getItem('refreshToken') // → có token
   ```

**Show Redux Debugger:**
6. Scroll xuống góc phải màn hình
7. Point vào Redux Debugger panel
8. Highlight:
   - ✅ Authenticated status
   - User info (email, role)
   - Tokens present

**Nói:**
> "Login thành công!
> - Redux state updated với user info
> - Tokens được lưu vào localStorage
> - Redux Debugger hiển thị real-time state
> - Tự động redirect về trang profile"

---

#### 4.5. Test Protected Routes - User Access (1.5 phút)

**Actions:**
1. Đang ở `/profile` - Show user info
2. Click các links:
   - "Upload Avatar" → `/upload-avatar` ✅
   - "Trang chủ" → `/` ✅

**Nói:**
> "User đã login có thể truy cập:
> - Profile page ✅
> - Upload avatar ✅
> - Tất cả public pages ✅"

**Test Admin Route:**
3. Manually vào `/admin` trong address bar
4. → Redirect về `/` ❌

**Nói:**
> "Nhưng không thể vào admin page vì role = 'user', không phải 'admin'.
> Protected route với role check hoạt động!"

---

#### 4.6. Test Page Refresh - Persistent State (1 phút)

**Actions:**
1. Đang ở trang profile
2. Nhấn F5 refresh page
3. Quan sát:
   - Vẫn còn đăng nhập ✅
   - User info vẫn hiển thị ✅
   - Redux state vẫn đúng ✅

**Show Redux DevTools:**
4. State vẫn có user, tokens

**Show Console:**
5. Chạy:
   ```javascript
   localStorage.getItem('accessToken')  // → vẫn còn
   ```

**Nói:**
> "State persistence hoạt động!
> Redux auto-load từ localStorage khi app mount.
> User không bị logout sau khi refresh page."

---

#### 4.7. Test Logout (30 giây)

**Actions:**
1. Click nút "Đăng xuất"
2. Observe Redux DevTools:
   - Action: `auth/logout`
   - State cleared
3. Check Console:
   ```javascript
   localStorage.getItem('accessToken')  // → null
   ```
4. Redirect về `/login`

**Nói:**
> "Logout clear toàn bộ Redux state và localStorage,
> redirect về login page."

---

#### 4.8. Test Admin Access (1.5 phút)

**Actions:**
1. Login với admin account:
   ```
   Email: admin@example.com
   Password: admin123
   ```

**Show Redux State:**
2. Redux DevTools → State:
   ```javascript
   user: {
     email: "admin@example.com",
     role: "admin",  // ← Highlight this!
     userId: "..."
   }
   ```

**Show Navigation:**
3. Nav bar bây giờ có thêm:
   - "Admin Dashboard" link ✅
   - "Activity Logs" link ✅

**Test Admin Routes:**
4. Click "Admin Dashboard" → `/admin` ✅
5. Show admin content
6. Click "Activity Logs" → `/admin/logs` ✅

**Nói:**
> "Admin có role = 'admin', nên có thể:
> - Truy cập tất cả user routes ✅
> - Truy cập admin-only routes ✅
> - Thấy admin navigation items ✅
> 
> Role-based access control hoạt động hoàn hảo!"

---

### PHẦN 5: CODE WALKTHROUGH (2 phút)

#### 5.1. Login Component với Redux
```javascript
// Mở: src/pages/Login.jsx
```

**Highlight:**
- `useDispatch`, `useSelector` imports
- `dispatch(loginUser({ email, password }))`
- `.unwrap()` để handle success/error
- Loading state từ Redux

**Nói:**
> "Login component sử dụng Redux hooks.
> Dispatch async thunk loginUser, handle response,
> và navigate sau khi thành công."

---

#### 5.2. App.jsx Routing
```javascript
// Mở: src/App.jsx
```

**Highlight:**
- Protected Route wrapping:
  ```jsx
  <Route path="/profile" element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  } />
  ```
- Admin route with role:
  ```jsx
  <Route path="/admin" element={
    <ProtectedRoute requiredRole="admin">
      <AdminDashboard />
    </ProtectedRoute>
  } />
  ```

**Nói:**
> "Routes configuration với ProtectedRoute wrapper.
> User routes cần login, admin routes cần role admin."

---

### PHẦN 6: REDUX DEBUGGER TOOL (1 phút)

**Show:**
1. Redux Debugger panel ở góc phải
2. Các features:
   - Authentication status
   - User info display
   - Token presence checker
   - Full state JSON viewer
   - LocalStorage status

**Nói:**
> "Em đã tạo Redux Debugger component để debug dễ dàng hơn.
> Tool này chỉ hiển thị trong development mode,
> cung cấp real-time view của Redux state."

---

### PHẦN 7: TESTING & DOCUMENTATION (1 phút)

**Show files:**
1. `test-redux-state.html`
   - Interactive test page
   - JWT decoder
   - Route tester

2. Documentation files:
   - `README_SV2_HOAT_DONG_6.md`
   - `BAO_CAO_HOAT_DONG_6.md`
   - `CHECKLIST_HOAT_DONG_6.md`

**Nói:**
> "Em đã chuẩn bị:
> - Test page HTML với UI đẹp
> - Documentation đầy đủ
> - Hướng dẫn sử dụng chi tiết
> - Checklist để kiểm tra"

---

### PHẦN 8: KẾT LUẬN (1 phút)

**Tóm tắt:**

**Nói:**
> "Tóm lại, em đã hoàn thành Hoạt động 6 với:
> 
> ✅ Redux Toolkit setup hoàn chỉnh
>    - Store configuration
>    - Auth slice với async thunks
>    - LocalStorage integration
> 
> ✅ Protected Routes
>    - Authentication check
>    - Role-based access control
>    - Auto redirect logic
> 
> ✅ Features nâng cao
>    - Persistent authentication
>    - JWT decoding
>    - Redux Debugger tool
>    - Comprehensive documentation
> 
> Tất cả đã được test kỹ và hoạt động ổn định.
> Cảm ơn thầy/cô đã theo dõi!"

---

## 📹 TIPS GHI HÌNH CHUYÊN NGHIỆP

### 1. Setup Recording:

**OBS Studio Settings:**
- Canvas: 1920x1080 (Full HD)
- FPS: 30
- Bitrate: 2500 kbps
- Audio: Microphone ON, clear background

**Layout:**
```
┌─────────────────────────────────────┐
│  VS Code (Left) │  Browser (Right)  │
│                 │                   │
│  Code showing   │  App running      │
│  Redux files    │  + DevTools       │
└─────────────────────────────────────┘
```

### 2. Recording Checklist:

**Trước khi record:**
- [ ] Close unnecessary apps
- [ ] Clean desktop
- [ ] Browser: Close extra tabs
- [ ] VS Code: Zoom font 16-18px
- [ ] Browser: Zoom 110-125%
- [ ] Turn off notifications
- [ ] Mute phone
- [ ] Test microphone
- [ ] Clear localStorage
- [ ] Restart backend & frontend

**Trong khi record:**
- [ ] Nói rõ ràng, không quá nhanh
- [ ] Pause giữa các phần
- [ ] Point chuột vào những gì đang nói
- [ ] Highlight code quan trọng
- [ ] Show Redux DevTools actions
- [ ] Demo từng step cẩn thận

**Sau khi record:**
- [ ] Review video
- [ ] Check audio quality
- [ ] Add intro slide (optional)
- [ ] Add outro với contact
- [ ] Export MP4 format

### 3. Script Navigation:

**Mở sẵn tabs:**

Browser:
1. http://localhost:3000 (Homepage)
2. http://localhost:3000/login
3. http://localhost:3000/signup
4. Redux DevTools ready

VS Code:
1. `src/redux/store.js`
2. `src/redux/authSlice.js`
3. `src/components/ProtectedRoute.jsx`
4. `src/pages/Login.jsx`
5. `src/App.jsx`
6. `BAO_CAO_HOAT_DONG_6.md`

### 4. Timing Guide:

```
00:00 - 01:30  Giới thiệu
01:30 - 04:00  Redux architecture code
04:00 - 06:00  Protected Routes code
06:00 - 14:00  Live demo
14:00 - 16:00  Code walkthrough
16:00 - 17:00  Tools & docs
17:00 - 18:00  Kết luận
```

### 5. Common Mistakes to Avoid:

❌ Nói quá nhanh
❌ Không show Redux DevTools
❌ Quên test protected routes
❌ Không demo admin vs user role
❌ Quên test page refresh
❌ Font quá nhỏ
❌ Background ồn ào

✅ Nói rõ ràng, từ tốn
✅ Show mọi Redux action
✅ Test đầy đủ scenarios
✅ Demo cả 2 roles
✅ Test persistence
✅ Font size 16-18px
✅ Môi trường yên tĩnh

---

## 🎤 SCRIPT MẪU CHI TIẾT

### Opening:
> "Xin chào thầy/cô và các bạn! Em là [Tên], thành viên Frontend số 2 của nhóm 12.
> 
> Hôm nay em xin phép được trình bày Hoạt động 6: Frontend Redux và Protected Routes.
> 
> Presentation của em sẽ bao gồm 3 phần chính:
> 1. Giới thiệu kiến trúc Redux
> 2. Demo thực tế các tính năng
> 3. Tổng kết và documentation
> 
> Thời gian dự kiến khoảng 15 phút. Bây giờ em xin bắt đầu!"

### During Code Walkthrough:
> "Ở đây, em sử dụng Redux Toolkit - công cụ chính thức của Redux.
> createSlice giúp em tạo reducer một cách đơn giản hơn,
> và createAsyncThunk xử lý async operations như API calls.
> 
> Đặc biệt, em có implement một JWT decoder function
> để extract user information trực tiếp từ token,
> thay vì phải gọi API thêm một lần nữa."

### During Demo:
> "Bây giờ em sẽ login với tài khoản user thường.
> Như các bạn thấy ở Redux DevTools, action login/pending được dispatch,
> sau đó login/fulfilled khi API response về.
> 
> State được update với user info và tokens,
> và quan trọng là tokens được lưu vào localStorage
> để persist authentication qua page refreshes."

### Closing:
> "Vậy là em đã demo xong tất cả features của Hoạt động 6.
> 
> Tóm lại, em đã triển khai thành công:
> - Redux Toolkit cho state management
> - Protected Routes với role-based access
> - Persistent authentication
> - Và các debug tools hỗ trợ
> 
> Tất cả source code và documentation em đã push lên GitHub.
> Em xin cảm ơn thầy/cô và các bạn đã theo dõi.
> 
> Nếu có câu hỏi gì, em rất sẵn lòng trả lời ạ!"

---

## 📊 DEMO SCENARIOS CHECKLIST

### Scenario 1: Unauthenticated User
- [ ] Visit homepage → See login prompt
- [ ] Try `/profile` → Redirect to `/login`
- [ ] Try `/admin` → Redirect to `/login`
- [ ] Check Redux state → `isAuthenticated: false`
- [ ] Check localStorage → No tokens

### Scenario 2: User Signup & Login
- [ ] Signup new account
- [ ] See Redux action `signup/fulfilled`
- [ ] Login with new account
- [ ] See Redux actions flow
- [ ] Check state updated
- [ ] Check tokens in localStorage
- [ ] Auto redirect to profile

### Scenario 3: Authenticated Regular User
- [ ] Access `/profile` → Success ✅
- [ ] Access `/upload-avatar` → Success ✅
- [ ] Try `/admin` → Redirect to `/` ❌
- [ ] See user info in nav
- [ ] Check role in Redux state

### Scenario 4: Persistent Authentication
- [ ] Login successfully
- [ ] Refresh page (F5)
- [ ] Still authenticated ✅
- [ ] User info still displayed ✅
- [ ] Redux state restored ✅

### Scenario 5: Logout
- [ ] Click logout button
- [ ] See Redux action `logout`
- [ ] State cleared
- [ ] Tokens removed from localStorage
- [ ] Redirect to login

### Scenario 6: Admin User
- [ ] Login as admin
- [ ] Check role in Redux state: "admin"
- [ ] See admin links in nav
- [ ] Access `/admin` → Success ✅
- [ ] Access `/admin/logs` → Success ✅
- [ ] All admin features available

---

## 🎬 POST-PRODUCTION

### Video Editing (Optional):
1. **Intro Slide (5-10 seconds):**
   ```
   HOẠT ĐỘNG 6
   Frontend Redux & Protected Routes
   
   Nhóm: 12
   Thành viên: [Tên]
   ```

2. **Chapter Markers:**
   - 0:00 Giới thiệu
   - 1:30 Redux Architecture
   - 4:00 Protected Routes
   - 6:00 Live Demo
   - 14:00 Code Review
   - 17:00 Kết luận

3. **Annotations:**
   - Highlight key code sections
   - Add text boxes for important points
   - Circle mouse pointer when needed

### Export Settings:
- Format: MP4
- Resolution: 1920x1080
- Bitrate: 5000 kbps
- Audio: AAC 192kbps
- File size: ~100-200MB for 15 min

---

## 📤 SUBMISSION

### Files to Submit:
1. **Video:** `DEMO_HOAT_DONG_6_[TEN].mp4`
2. **Source code:** GitHub link
3. **Documentation:** `BAO_CAO_HOAT_DONG_6.md`
4. **Screenshots:** Key moments (optional)

### GitHub PR:
- Title: "Hoạt động 6 - Redux & Protected Routes"
- Description: Link to video + summary
- Reviewers: Assign team members

---

## ✅ FINAL CHECKLIST

**Trước khi submit:**
- [ ] Video recorded and reviewed
- [ ] Audio clear and understandable
- [ ] All features demoed
- [ ] Code pushed to GitHub
- [ ] Documentation complete
- [ ] PR created
- [ ] Video uploaded (Google Drive/YouTube)
- [ ] Link shared with instructor

---

**Good luck với demo! 🚀**

Bạn sẽ làm tuyệt vời! Remember:
- Tự tin, nói rõ ràng
- Show Redux DevTools
- Test đầy đủ scenarios
- Smile và enjoy! 😊
