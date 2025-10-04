import React, { useState } from 'react';
import api from './api';

function AddUser({ onAdded }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) { setErr('Tên không được để trống'); return; }
    setLoading(true);
    try {
      await api.post('/users', { name: name.trim(), email: email.trim() || undefined });
      setName(''); setEmail(''); setErr(null);
      onAdded && onAdded();
    } catch (e) {
      setErr(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Tên" />
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email (tuỳ chọn)" />
      <button type="submit" disabled={loading}>{loading ? 'Đang thêm...' : 'Thêm user'}</button>
      {err && <div style={{color:'red'}}>{err}</div>}
    </form>
  );
}

export default AddUser;
