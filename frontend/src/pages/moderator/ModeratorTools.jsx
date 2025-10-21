import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function ModeratorTools() {
  const { user } = useSelector((state) => state.auth);
  const [posts] = useState([
    { id: 1, title: "Bài viết 1: Hướng dẫn sử dụng React", author: "user@example.com", status: "pending", content: "Nội dung mẫu về React..." },
    { id: 2, title: "Bài viết 2: Redux Toolkit best practices", author: "admin@example.com", status: "approved", content: "Hướng dẫn Redux..." },
    { id: 3, title: "Bài viết 3: RBAC trong Node.js", author: "mod@example.com", status: "pending", content: "Triển khai RBAC..." },
    { id: 4, title: "Bài viết 4: JWT Authentication", author: "user@example.com", status: "rejected", content: "Xác thực JWT..." },
  ]);

  const [filter, setFilter] = useState('all');

  const handleApprove = (postId) => {
    alert(`✅ Đã duyệt bài viết #${postId}`);
  };

  const handleReject = (postId) => {
    alert(`❌ Đã từ chối bài viết #${postId}`);
  };

  const filteredPosts = posts.filter(post => {
    if (filter === 'all') return true;
    return post.status === filter;
  });

  const getStatusBadge = (status) => {
    const colors = {
      pending: { bg: '#FFF3CD', text: '#856404', label: '⏳ Chờ duyệt' },
      approved: { bg: '#D4EDDA', text: '#155724', label: '✅ Đã duyệt' },
      rejected: { bg: '#F8D7DA', text: '#721C24', label: '❌ Từ chối' }
    };
    const style = colors[status] || colors.pending;
    return (
      <span style={{
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
        background: style.bg,
        color: style.text
      }}>
        {style.label}
      </span>
    );
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '20px' }}>
      {/* Header */}
      <div style={{ background: '#f57c00', color: 'white', padding: '30px', borderRadius: '12px', marginBottom: '30px' }}>
        <h1 style={{ margin: 0, fontSize: '32px' }}>⚡ Moderator Tools</h1>
        <p style={{ margin: '10px 0 0 0', opacity: 0.9 }}>Quản lý và duyệt nội dung</p>
        <p style={{ margin: '5px 0 0 0', fontSize: '14px', opacity: 0.8 }}>
          Moderator: <strong>{user?.email}</strong>
        </p>
      </div>

      {/* Back Link */}
      <div style={{ marginBottom: '20px' }}>
        <Link to="/" style={{ color: '#f57c00', textDecoration: 'none', fontSize: '14px' }}>
          ← Quay lại Dashboard
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ padding: '20px', background: '#FFF3CD', borderRadius: '10px', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#856404' }}>⏳ Chờ duyệt</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0, color: '#856404' }}>
            {posts.filter(p => p.status === 'pending').length}
          </p>
        </div>
        <div style={{ padding: '20px', background: '#D4EDDA', borderRadius: '10px', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#155724' }}>✅ Đã duyệt</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0, color: '#155724' }}>
            {posts.filter(p => p.status === 'approved').length}
          </p>
        </div>
        <div style={{ padding: '20px', background: '#F8D7DA', borderRadius: '10px', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#721C24' }}>❌ Từ chối</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0, color: '#721C24' }}>
            {posts.filter(p => p.status === 'rejected').length}
          </p>
        </div>
      </div>

      {/* Filter */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <span style={{ fontWeight: '600' }}>Lọc theo trạng thái:</span>
        <button
          onClick={() => setFilter('all')}
          style={{
            padding: '8px 16px',
            background: filter === 'all' ? '#f57c00' : '#f0f0f0',
            color: filter === 'all' ? 'white' : '#333',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Tất cả ({posts.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          style={{
            padding: '8px 16px',
            background: filter === 'pending' ? '#f57c00' : '#f0f0f0',
            color: filter === 'pending' ? 'white' : '#333',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Chờ duyệt ({posts.filter(p => p.status === 'pending').length})
        </button>
        <button
          onClick={() => setFilter('approved')}
          style={{
            padding: '8px 16px',
            background: filter === 'approved' ? '#f57c00' : '#f0f0f0',
            color: filter === 'approved' ? 'white' : '#333',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Đã duyệt ({posts.filter(p => p.status === 'approved').length})
        </button>
        <button
          onClick={() => setFilter('rejected')}
          style={{
            padding: '8px 16px',
            background: filter === 'rejected' ? '#f57c00' : '#f0f0f0',
            color: filter === 'rejected' ? 'white' : '#333',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Từ chối ({posts.filter(p => p.status === 'rejected').length})
        </button>
      </div>

      {/* Posts List */}
      <div style={{ background: 'white', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ padding: '20px', borderBottom: '2px solid #f0f0f0' }}>
          <h2 style={{ margin: 0 }}>📝 Danh sách bài viết ({filteredPosts.length})</h2>
        </div>
        
        {filteredPosts.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
            Không có bài viết nào trong danh mục này
          </div>
        ) : (
          <div>
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                style={{
                  padding: '20px',
                  borderBottom: '1px solid #f0f0f0',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f9f9f9'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>{post.title}</h3>
                    <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#666' }}>
                      👤 Tác giả: <strong>{post.author}</strong>
                    </p>
                    <p style={{ margin: 0, fontSize: '14px', color: '#888', lineHeight: '1.5' }}>
                      {post.content}
                    </p>
                  </div>
                  <div style={{ marginLeft: '20px' }}>
                    {getStatusBadge(post.status)}
                  </div>
                </div>

                {post.status === 'pending' && (
                  <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                    <button
                      onClick={() => handleApprove(post.id)}
                      style={{
                        padding: '8px 20px',
                        background: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '14px'
                      }}
                    >
                      ✅ Duyệt bài
                    </button>
                    <button
                      onClick={() => handleReject(post.id)}
                      style={{
                        padding: '8px 20px',
                        background: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '14px'
                      }}
                    >
                      ❌ Từ chối
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div style={{ marginTop: '30px', padding: '20px', background: '#E3F2FD', borderRadius: '10px' }}>
        <h3 style={{ marginTop: 0 }}>ℹ️ Hướng dẫn sử dụng</h3>
        <ul style={{ lineHeight: '2' }}>
          <li>Moderator có thể duyệt hoặc từ chối bài viết</li>
          <li>Sử dụng bộ lọc để xem bài viết theo trạng thái</li>
          <li>Chỉ Moderator và Admin mới có quyền truy cập trang này</li>
        </ul>
      </div>
    </div>
  );
}
