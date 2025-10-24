import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Profile Page</h1>
      <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
        <h2>User Information</h2>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Role:</strong> {user?.role}</p>
        <p><strong>User ID:</strong> {user?.userId}</p>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <Link to="/upload-avatar" style={{ 
          padding: '10px 20px', 
          background: '#007bff', 
          color: 'white', 
          textDecoration: 'none',
          borderRadius: '4px',
          display: 'inline-block'
        }}>
          Upload Avatar
        </Link>
      </div>
    </div>
  );
}
