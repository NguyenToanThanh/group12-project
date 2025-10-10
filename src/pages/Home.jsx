import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  return (
    <div style={{ padding: 24 }}>
      <h2>Dashboard</h2>
      <p>Xin chào: {user?.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}