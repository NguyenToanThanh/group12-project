import { useSelector } from 'react-redux';

export default function ReduxDebugger() {
  const authState = useSelector((state) => state.auth);

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '20px', 
      right: '20px', 
      background: '#2d2d2d', 
      color: '#f8f8f2',
      padding: '15px',
      borderRadius: '8px',
      maxWidth: '400px',
      maxHeight: '500px',
      overflow: 'auto',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      fontSize: '12px',
      zIndex: 9999
    }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#50fa7b' }}>🔍 Redux State Debugger</h3>
      
      <div style={{ marginBottom: '10px' }}>
        <strong style={{ color: '#8be9fd' }}>Authentication Status:</strong>
        <div style={{ 
          display: 'inline-block', 
          marginLeft: '10px',
          padding: '3px 8px',
          borderRadius: '4px',
          background: authState.isAuthenticated ? '#50fa7b' : '#ff5555',
          color: '#000'
        }}>
          {authState.isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}
        </div>
      </div>

      {authState.loading && (
        <div style={{ 
          padding: '8px', 
          background: '#f1fa8c', 
          color: '#000',
          borderRadius: '4px',
          marginBottom: '10px'
        }}>
          ⏳ Loading...
        </div>
      )}

      {authState.error && (
        <div style={{ 
          padding: '8px', 
          background: '#ff5555', 
          color: '#fff',
          borderRadius: '4px',
          marginBottom: '10px'
        }}>
          ❌ Error: {authState.error}
        </div>
      )}

      {authState.user && (
        <div style={{ marginTop: '10px' }}>
          <strong style={{ color: '#8be9fd' }}>User Info:</strong>
          <div style={{ marginLeft: '10px', marginTop: '5px' }}>
            <div>📧 Email: <span style={{ color: '#f1fa8c' }}>{authState.user.email}</span></div>
            <div>👤 Role: <span style={{ color: '#ff79c6' }}>{authState.user.role}</span></div>
            <div>🆔 User ID: <span style={{ color: '#bd93f9' }}>{authState.user.userId}</span></div>
          </div>
        </div>
      )}

      <div style={{ marginTop: '10px' }}>
        <strong style={{ color: '#8be9fd' }}>Tokens:</strong>
        <div style={{ marginLeft: '10px', marginTop: '5px' }}>
          <div>
            🔑 Access: 
            {authState.accessToken ? (
              <span style={{ color: '#50fa7b' }}> ✓ Present ({authState.accessToken.substring(0, 20)}...)</span>
            ) : (
              <span style={{ color: '#ff5555' }}> ✗ None</span>
            )}
          </div>
          <div>
            🔄 Refresh: 
            {authState.refreshToken ? (
              <span style={{ color: '#50fa7b' }}> ✓ Present</span>
            ) : (
              <span style={{ color: '#ff5555' }}> ✗ None</span>
            )}
          </div>
        </div>
      </div>

      <details style={{ marginTop: '15px' }}>
        <summary style={{ cursor: 'pointer', color: '#ff79c6' }}>
          📦 Full State (JSON)
        </summary>
        <pre style={{ 
          marginTop: '10px',
          padding: '10px',
          background: '#1e1e1e',
          borderRadius: '4px',
          overflow: 'auto',
          maxHeight: '200px',
          fontSize: '11px'
        }}>
          {JSON.stringify(authState, null, 2)}
        </pre>
      </details>

      <details style={{ marginTop: '10px' }}>
        <summary style={{ cursor: 'pointer', color: '#ff79c6' }}>
          💾 LocalStorage
        </summary>
        <div style={{ marginTop: '10px', fontSize: '11px' }}>
          <div>Access Token: {localStorage.getItem('accessToken') ? '✓' : '✗'}</div>
          <div>Refresh Token: {localStorage.getItem('refreshToken') ? '✓' : '✗'}</div>
        </div>
      </details>

      <div style={{ 
        marginTop: '15px', 
        paddingTop: '10px', 
        borderTop: '1px solid #44475a',
        fontSize: '10px',
        color: '#6272a4'
      }}>
        💡 Tip: Install Redux DevTools extension for better debugging
      </div>
    </div>
  );
}
