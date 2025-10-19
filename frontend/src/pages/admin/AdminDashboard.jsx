import { useSelector } from 'react-redux';

export default function AdminDashboard() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Admin Dashboard</h1>
      <div style={{ background: '#fff3cd', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
        <p>Welcome, <strong>{user?.email}</strong></p>
        <p>You have admin access to this page.</p>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <h2>Admin Features</h2>
        <ul>
          <li>User Management</li>
          <li>System Settings</li>
          <li>Activity Logs</li>
        </ul>
      </div>
    </div>
  );
}
