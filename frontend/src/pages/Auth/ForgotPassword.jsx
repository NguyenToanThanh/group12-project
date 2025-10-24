import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setToken("");

    if (!email) {
      setMessage("❌ Vui lòng nhập email");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("❌ Email không hợp lệ");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/forgot-password", { email });
      
      setMessage(`✅ ${response.data.message}`);
      
      // Hiển thị token (demo - trong thực tế sẽ gửi email)
      if (response.data.token) {
        setToken(response.data.token);
        console.log("🔑 Reset Token:", response.data.token);
      }
    } catch (error) {
      setMessage(`❌ Lỗi: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: "60px auto", padding: 30, background: "#f9f9f9", borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
      <h1 style={{ color: "#2196F3", marginBottom: 10 }}>🔐 Quên mật khẩu</h1>
      <p style={{ color: "#666", marginBottom: 30, fontSize: 14 }}>
        Nhập email để nhận link đặt lại mật khẩu
      </p>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email của bạn"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          style={{
            display: "block",
            width: "100%",
            padding: "14px",
            marginBottom: 16,
            borderRadius: "8px",
            border: "2px solid #ddd",
            fontSize: "15px",
            outline: "none",
            transition: "border 0.3s",
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            background: loading ? "#ccc" : "#2196F3",
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
          {loading ? "⏳ Đang xử lý..." : "📧 Gửi yêu cầu"}
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
        </div>
      )}

      {/* Token (demo) */}
      {token && (
        <div
          style={{
            padding: 20,
            background: "#FFF9C4",
            border: "2px solid #FBC02D",
            borderRadius: 8,
            marginBottom: 20,
          }}
        >
          <h3 style={{ color: "#F57F17", marginBottom: 10, fontSize: 16 }}>
            🔑 Token Reset (Demo)
          </h3>
          <p style={{ fontSize: 13, color: "#666", marginBottom: 10 }}>
            Trong thực tế, token sẽ được gửi qua email. Copy token này để reset password:
          </p>
          <div
            style={{
              padding: 12,
              background: "white",
              borderRadius: 6,
              fontFamily: "monospace",
              fontSize: 12,
              wordBreak: "break-all",
              color: "#333",
              border: "1px solid #ddd",
            }}
          >
            {token}
          </div>
          <Link
            to={`/reset-password?token=${token}`}
            style={{
              display: "inline-block",
              marginTop: 15,
              padding: "10px 20px",
              background: "#4CAF50",
              color: "white",
              borderRadius: 6,
              textDecoration: "none",
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            ➡️ Đến trang Reset Password
          </Link>
        </div>
      )}

      {/* Links */}
      <div style={{ textAlign: "center", marginTop: 20, lineHeight: 2 }}>
        <Link to="/login" style={{ color: "#2196F3", textDecoration: "none", fontSize: 14 }}>
          ← Quay lại đăng nhập
        </Link>
      </div>
    </div>
  );
}
