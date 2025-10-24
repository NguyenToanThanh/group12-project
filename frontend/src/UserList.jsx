import React, { useEffect, useState } from "react";
import api from "./api";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      alert("Không thể lấy danh sách users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá user này?")) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error(err);
      alert("Không thể xoá user");
    }
  };

  const styles = {
    container: {
      padding: "24px",
      maxWidth: "1200px",
      margin: "0 auto",
    },
    header: {
      marginBottom: "24px",
    },
    title: {
      fontSize: "28px",
      fontWeight: "700",
      color: "#1a202c",
      marginBottom: "8px",
    },
    subtitle: {
      fontSize: "14px",
      color: "#718096",
    },
    tableContainer: {
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)",
      overflow: "hidden",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    thead: {
      backgroundColor: "#f7fafc",
      borderBottom: "2px solid #e2e8f0",
    },
    th: {
      padding: "16px 20px",
      textAlign: "left",
      fontSize: "12px",
      fontWeight: "600",
      color: "#4a5568",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
    },
    td: {
      padding: "16px 20px",
      fontSize: "14px",
      color: "#2d3748",
      borderBottom: "1px solid #e2e8f0",
    },
    deleteButton: {
      backgroundColor: "#fc8181",
      color: "#ffffff",
      border: "none",
      padding: "8px 16px",
      borderRadius: "6px",
      fontSize: "13px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s",
    },
    emptyState: {
      textAlign: "center",
      padding: "60px 20px",
      color: "#a0aec0",
    },
    loadingState: {
      textAlign: "center",
      padding: "60px 20px",
      color: "#4a5568",
    },
    badge: {
      display: "inline-block",
      padding: "4px 12px",
      borderRadius: "12px",
      fontSize: "12px",
      fontWeight: "500",
      backgroundColor: "#bee3f8",
      color: "#2c5282",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>👥 Danh sách Users</h2>
        <p style={styles.subtitle}>
          Quản lý và theo dõi tất cả người dùng trong hệ thống
        </p>
      </div>

      <div style={styles.tableContainer}>
        {loading ? (
          <div style={styles.loadingState}>
            <p>⏳ Đang tải dữ liệu...</p>
          </div>
        ) : users.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={{ fontSize: "48px", margin: "0" }}>📭</p>
            <p style={{ fontSize: "16px", marginTop: "12px" }}>
              Chưa có user nào
            </p>
            <p style={{ fontSize: "14px", marginTop: "4px" }}>
              Thêm user đầu tiên để bắt đầu
            </p>
          </div>
        ) : (
          <table style={styles.table}>
            <thead style={styles.thead}>
              <tr>
                <th style={styles.th}>STT</th>
                <th style={styles.th}>Tên người dùng</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Vai trò</th>
                <th style={styles.th}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, index) => (
                <tr
                  key={u._id}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#ffffff" : "#f7fafc",
                  }}
                >
                  <td style={styles.td}>{index + 1}</td>
                  <td style={styles.td}>
                    <strong>{u.name}</strong>
                  </td>
                  <td style={styles.td}>{u.email}</td>
                  <td style={styles.td}>
                    <span style={styles.badge}>
                      {u.role || "User"}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button
                      onClick={() => handleDelete(u._id)}
                      style={styles.deleteButton}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#f56565";
                        e.target.style.transform = "translateY(-1px)";
                        e.target.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "#fc8181";
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = "none";
                      }}
                    >
                      🗑️ Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default UserList;
