import React, { useEffect, useState } from 'react';
import api from './api';

function UserList({ refreshFlag }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api.get('/users')
      .then(res => { if (mounted) { setUsers(res.data); setErr(null); } })
      .catch(e => { if (mounted) setErr(e.response?.data?.message || e.message); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [refreshFlag]);

  if (loading) return <p>Đang tải...</p>;
  if (err) return <p style={{color:'red'}}>Lỗi: {err}</p>;

  return (
    <div>
      <h2>Danh sách Users</h2>
      <ul>
        {users.map(u => (
          <li key={u._id}>{u.name}{u.email ? ` — ${u.email}` : ''}</li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
