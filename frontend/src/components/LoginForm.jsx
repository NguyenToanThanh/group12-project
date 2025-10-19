import React, { useState } from "react";
import API from "../API";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setMessage("Đăng nhập thành công!");
    } catch (err) {
      setMessage("Đăng nhập thất bại: " + err.response?.data?.message);
    }
  };

  return (
    <div className="form-container">
      <h2>Đăng nhập</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={email}
               onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Mật khẩu" value={password}
               onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Đăng nhập</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default Login;
