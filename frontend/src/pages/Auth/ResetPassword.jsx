import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../../api/axios";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Lấy token từ URL query params
  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      console.log("🔑 Token from URL:", tokenFromUrl);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // Validate
    if (!token) {
      setMessage("❌ Thiếu token reset. Vui lòng nhập hoặc lấy từ email.");
      return;
    }

    if (!password) {
      setMessage("❌ Vui lòng nhập mật khẩu mới");
      return;
    }

    if (password.length < 6) {
      setMessage("❌ Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("❌ Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/reset-password", { token, password });
      
      setMessage(`✅ ${response.data.message}`);
      console.log("✅ Reset password thành công");

      // Chuyển về login sau 2 giây
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setMessage(`❌ ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: "60px auto", padding: 30, background: "#f9f9f9", borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
      <h1 style={{ color: "#4CAF50", marginBottom: 10 }}>🔑 Đặt lại mật khẩu</h1>
      <p style={{ color: "#666", marginBottom: 30, fontSize: 14 }}>
        Nhập mật khẩu mới của bạn
      </p>

      <form onSubmit={handleSubmit}>
        {/* Token Input */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 6, color: "#555", fontSize: 14, fontWeight: 600 }}>
            Reset Token
          </label>
          <input
            type="text"
            placeholder="Token từ email hoặc URL"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            disabled={loading}
            style={{
              display: "block",
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "2px solid #ddd",
              fontSize: "13px",
              fontFamily: "monospace",
              outline: "none",
            }}
          />
        </div>

        {/* Password Input */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 6, color: "#555", fontSize: 14, fontWeight: 600 }}>
            Mật khẩu mới
          </label>
          <input
            type="password"
            placeholder="Ít nhất 6 ký tự"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            style={{
              display: "block",
              width: "100%",
              padding: "14px",
              borderRadius: "8px",
              border: "2px solid #ddd",
              fontSize: "15px",
              outline: "none",
            }}
          />
        </div>

        {/* Confirm Password Input */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", marginBottom: 6, color: "#555", fontSize: 14, fontWeight: 600 }}>
            Xác nhận mật khẩu
          </label>
          <input
            type="password"
            placeholder="Nhập lại mật khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
            style={{
              display: "block",
              width: "100%",
              padding: "14px",
              borderRadius: "8px",
              border: "2px solid #ddd",
              fontSize: "15px",
              outline: "none",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            background: loading ? "#ccc" : "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer",
            marginBottom: 20,
            transition: "background 0.3s",
          }}
        >
          {loading ? "⏳ Đang xử lý..." : "✅ Đặt lại mật khẩu"}
        </button>
      </form>

      {/* Message */}
      {message && (
        <div
          style={{
            padding: 15,
            borderRadius: 8,
            background: message.includes("✅") ? "#E8F5E9" : "#FFEBEE",
            color: message.includes("✅") ? "#4CAF50" : "#f44336",
            fontWeight: 500,
            marginBottom: 20,
          }}
        >
          {message}
          {message.includes("✅") && (
            <p style={{ marginTop: 10, fontSize: 13 }}>
              Đang chuyển về trang đăng nhập...
            </p>
          )}
        </div>
      )}

      {/* Links */}
      <div style={{ textAlign: "center", marginTop: 20, lineHeight: 2 }}>
        <Link to="/forgot-password" style={{ color: "#2196F3", textDecoration: "none", fontSize: 14, marginRight: 15 }}>
          ← Quay lại Forgot Password
        </Link>
        <Link to="/login" style={{ color: "#2196F3", textDecoration: "none", fontSize: 14 }}>
          Đăng nhập
        </Link>
      </div>
    </div>
  );
}
