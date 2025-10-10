import React, { useState } from "react";
import API from "../API";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/signup", { email, password });
      setMessage("Đăng ký thành công!");
    } catch (err) {
      setMessage("Đăng ký thất bại: " + err.response?.data?.message);
    }
  };

  return (
    <div className="form-container">
      <h2>Đăng ký</h2>
      <form onSubmit={handleSignup}>
        <input type="email" placeholder="Email" value={email}
               onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Mật khẩu" value={password}
               onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Đăng ký</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default Signup;
