import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { signupUser, clearError } from '../redux/authSlice';

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");
    dispatch(clearError());
    
    if (!name || !email || !password) {
      setMessage("Vui lòng điền đầy đủ thông tin");
      return;
    }
    
    try {
      await dispatch(signupUser({ name, email, password })).unwrap();
      setMessage("✅ Đăng ký thành công! Đang chuyển đến đăng nhập...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMessage("❌ Đăng ký thất bại: " + (err || "Lỗi không xác định"));
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: "60px auto", padding: "20px" }}>
      <h1>Đăng ký tài khoản</h1>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Họ và tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
          style={{ display: "block", width: "100%", padding: "12px", marginBottom: 12, borderRadius: "6px", border: "1px solid #ddd", fontSize: "15px" }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          style={{ display: "block", width: "100%", padding: "12px", marginBottom: 12, borderRadius: "6px", border: "1px solid #ddd", fontSize: "15px" }}
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          style={{ display: "block", width: "100%", padding: "12px", marginBottom: 12, borderRadius: "6px", border: "1px solid #ddd", fontSize: "15px" }}
        />

        {message && (
          <div style={{ color: message.includes("✅") ? "#4CAF50" : "#f44336", background: message.includes("✅") ? "#E8F5E9" : "#FFEBEE", padding: "12px", marginBottom: 12, borderRadius: "6px", fontWeight: "500" }}>
            {message}
          </div>
        )}

        <button type="submit" disabled={loading} style={{ width: "100%", padding: "12px", background: loading ? "#ccc" : "#2196F3", color: "white", border: "none", borderRadius: "6px", fontSize: "16px", cursor: loading ? "not-allowed" : "pointer", fontWeight: "600" }}>
          {loading ? "Đang xử lý..." : "Đăng ký"}
        </button>
      </form>

      <div style={{ marginTop: 20, textAlign: "center", lineHeight: 2 }}>
        <Link to="/login" style={{ color: "#2196F3", textDecoration: "none" }}>Đã có tài khoản? Đăng nhập ngay</Link>
      </div>
    </div>
  );
}

export default Signup;
