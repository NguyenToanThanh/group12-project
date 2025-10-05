import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import api from "./api";
import LoginPage from "./pages/LoginPage";

function HomePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await api.get("/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (error) {
        console.error("Lỗi khi tải profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <h2>Đang tải...</h2>;
  if (!user)
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>Vui lòng đăng nhập để xem thông tin.</h2>
        <Link to="/login">👉 Đăng nhập tại đây</Link>
      </div>
    );

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Thông tin người dùng</h1>
      <p><strong>Tên:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Vai trò:</strong> {user.role}</p>
      <button
        onClick={() => {
          localStorage.clear();
          window.location.reload();
        }}
      >
        Đăng xuất
      </button>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
