import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, user } = res.data;

      // ✅ Lưu token và user info
      localStorage.setItem("accessToken", token);
      localStorage.setItem("userInfo", JSON.stringify(user));

      alert("Đăng nhập thành công!");
      navigate("/"); // chuyển về trang chính
    } catch (err) {
      console.error(err);
      alert("Sai thông tin đăng nhập!");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Đăng nhập</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br /><br />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />
        <button type="submit">Đăng nhập</button>
      </form>
    </div>
  );
}

export default LoginPage;
