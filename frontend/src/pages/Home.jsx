import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import RoleGate from "../components/RoleGate";

export default function Home() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (!isAuthenticated) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <h1>🎉 Chào mừng đến với hệ thống RBAC + Redux</h1>
        <p>Vui lòng đăng nhập để tiếp tục</p>
        <Link to="/login">
          <button style={{ padding: "12px 24px", fontSize: "16px", background: "#4CAF50", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
            Đăng nhập
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 960, margin: "40px auto", padding: 20 }}>
      <div style={{ background: "#f5f5f5", padding: 20, borderRadius: 10, marginBottom: 30 }}>
        <h2>Xin chào, {user?.email}!</h2>
        <p>Role: <strong style={{ color: user?.role === "admin" ? "#d32f2f" : user?.role === "moderator" ? "#f57c00" : "#388e3c", fontSize: "18px" }}>{user?.role}</strong></p>
        <p style={{ fontSize: "14px", color: "#666" }}>User ID: {user?.userId}</p>
        
        <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
          <Link to="/profile">
            <button style={{ padding: "10px 20px", background: "#2196F3", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
              Xem Profile
            </button>
          </Link>
          <button onClick={handleLogout} style={{ padding: "10px 20px", background: "#f44336", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
            Đăng xuất
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ padding: 20, border: "2px solid #4CAF50", borderRadius: 10 }}>
          <h3>✅ Chức năng của tất cả user</h3>
          <Link to="/profile">
            <button style={{ padding: "10px 20px", background: "#4CAF50", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
              Xem Profile
            </button>
          </Link>
        </div>

        <RoleGate
          allowed={["moderator", "admin"]}
          userRole={user?.role}
          fallback={
            <div style={{ padding: 20, border: "2px dashed #ccc", borderRadius: 10, opacity: 0.5 }}>
              <h3>🔒 Moderator Tools (Bạn không có quyền)</h3>
            </div>
          }
        >
          <div style={{ padding: 20, border: "2px solid #f57c00", borderRadius: 10 }}>
            <h3>⚡ Moderator Tools</h3>
            <Link to="/moderator">
              <button style={{ padding: "10px 20px", background: "#f57c00", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                Quản lý bài viết
              </button>
            </Link>
          </div>
        </RoleGate>

        <RoleGate
          allowed={["admin"]}
          userRole={user?.role}
          fallback={
            <div style={{ padding: 20, border: "2px dashed #ccc", borderRadius: 10, opacity: 0.5 }}>
              <h3>🔒 Admin Panel (Bạn không có quyền)</h3>
            </div>
          }
        >
          <div style={{ padding: 20, border: "2px solid #d32f2f", borderRadius: 10 }}>
            <h3>👑 Admin Panel</h3>
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <Link to="/admin">
                <button style={{ padding: "10px 20px", background: "#d32f2f", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                  Admin Dashboard
                </button>
              </Link>
              <Link to="/admin/logs">
                <button style={{ padding: "10px 20px", background: "#d32f2f", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                  Activity Logs
                </button>
              </Link>
            </div>
          </div>
        </RoleGate>
      </div>
      
      <div style={{ marginTop: "30px", padding: "20px", background: "#E3F2FD", borderRadius: "10px" }}>
        <h3>📦 Redux State Info</h3>
        <p>✅ Redux Store đang hoạt động</p>
        <p>✅ Protected Routes đã được cấu hình</p>
        <p>✅ Token được lưu trong localStorage và Redux state</p>
      </div>
    </div>
  );
}
