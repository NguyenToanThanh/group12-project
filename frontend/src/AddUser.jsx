import React, { useState } from "react";
import api from "./api";

function AddUser({ onUserAdded }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!name.trim()) {
      alert("Tên không được để trống");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      alert("Email không hợp lệ");
      return;
    }

    try {
      setLoading(true);
      await api.post("/users", { name, email });
      setName("");
      setEmail("");
      onUserAdded?.(); // refresh danh sách
      alert("✅ Thêm user thành công!");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "❌ Không thể thêm user");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      padding: "24px",
      maxWidth: "1200px",
      margin: "0 auto 24px",
    },
    card: {
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      padding: "24px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)",
    },
    title: {
      fontSize: "20px",
      fontWeight: "600",
      color: "#2d3748",
      marginBottom: "16px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    form: {
      display: "flex",
      gap: "12px",
      flexWrap: "wrap",
      alignItems: "flex-end",
    },
    inputGroup: {
      display: "flex",
      flexDirection: "column",
      flex: "1",
      minWidth: "200px",
    },
    label: {
      fontSize: "13px",
      fontWeight: "500",
      color: "#4a5568",
      marginBottom: "6px",
    },
    input: {
      padding: "10px 14px",
      fontSize: "14px",
      border: "1px solid #cbd5e0",
      borderRadius: "8px",
      outline: "none",
      transition: "all 0.2s",
    },
    button: {
      backgroundColor: "#4299e1",
      color: "#ffffff",
      border: "none",
      padding: "10px 24px",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      minWidth: "140px",
      justifyContent: "center",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h3 style={styles.title}>
          <span>➕</span>
          <span>Quản lý Users</span>
        </h3>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Tên người dùng</label>
            <input
              type="text"
              placeholder="Nhập tên user"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
              onFocus={(e) => {
                e.target.style.borderColor = "#4299e1";
                e.target.style.boxShadow = "0 0 0 3px rgba(66, 153, 225, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#cbd5e0";
                e.target.style.boxShadow = "none";
              }}
              disabled={loading}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              onFocus={(e) => {
                e.target.style.borderColor = "#4299e1";
                e.target.style.boxShadow = "0 0 0 3px rgba(66, 153, 225, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#cbd5e0";
                e.target.style.boxShadow = "none";
              }}
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            style={styles.button}
            disabled={loading}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = "#3182ce";
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#4299e1";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "none";
            }}
          >
            {loading ? (
              <>
                <span>⏳</span>
                <span>Đang thêm...</span>
              </>
            ) : (
              <>
                <span>✨</span>
                <span>Thêm user</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddUser;
