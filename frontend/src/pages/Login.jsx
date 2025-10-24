import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../redux/authSlice';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localErr, setLocalErr] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLocalErr("");
    dispatch(clearError());
    
    if (!email || !password) {
      setLocalErr("Vui lòng nhập email và mật khẩu");
      return;
    }

    try {
      const result = await dispatch(loginUser({ email, password })).unwrap();
      alert("Đăng nhập thành công!");
      navigate("/profile");
    } catch (err) {
      setLocalErr(err || "Đăng nhập thất bại");
    }
  };

  const displayError = localErr || error;

  return (
    <div style={{ maxWidth: 520, margin: "60px auto", padding: "20px" }}>
      <h1>Đăng nhập</h1>
      <form onSubmit={onSubmit}>
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          style={{ display: "block", width: "100%", padding: "12px", marginBottom: 12, borderRadius: "6px", border: "1px solid #ddd", fontSize: "15px" }}
        />
        <input
          placeholder="Mật khẩu"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          style={{ display: "block", width: "100%", padding: "12px", marginBottom: 12, borderRadius: "6px", border: "1px solid #ddd", fontSize: "15px" }}
        />
        
        {displayError && (
          <div style={{ color: "white", background: "#f44336", padding: "12px", marginBottom: 12, borderRadius: "6px" }}>
            {displayError}
          </div>
        )}
        
        <button type="submit" disabled={loading} style={{ width: "100%", padding: "12px", background: loading ? "#ccc" : "#4CAF50", color: "white", border: "none", borderRadius: "6px", fontSize: "16px", cursor: loading ? "not-allowed" : "pointer", fontWeight: "600" }}>
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>

      <div style={{ marginTop: 20, textAlign: "center", lineHeight: 2 }}>
        <Link to="/forgot-password" style={{ color: "#F57C00", textDecoration: "none", display: "block", marginBottom: 10 }}>
          🔐 Quên mật khẩu?
        </Link>
        <Link to="/signup" style={{ color: "#2196F3", textDecoration: "none" }}>Chưa có tài khoản? Đăng ký ngay</Link>
      </div>
    </div>
  );
}
