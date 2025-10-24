import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Helper: Decode JWT to get payload (role, email, etc.)
function decodeJWT(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('accessToken'));
  const [user, setUser] = useState(() => {
    const savedToken = localStorage.getItem('accessToken');
    if (savedToken) {
      const payload = decodeJWT(savedToken);
      return payload ? { email: payload.email, role: payload.role, userId: payload.userId } : null;
    }
    return null;
  });
  const [loading, setLoading] = useState(false);

  // Tự động decode token khi có token mới
  useEffect(() => {
    if (token) {
      const payload = decodeJWT(token);
      if (payload) {
        setUser({ email: payload.email, role: payload.role, userId: payload.userId });
      }
    }
  }, [token]);

  const login = (accessToken, refreshToken) => {
    // Được gọi từ Login.jsx sau khi nhận tokens từ backend
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setToken(accessToken);
    
    // Decode để lấy user info
    const payload = decodeJWT(accessToken);
    if (payload) {
      setUser({ email: payload.email, role: payload.role, userId: payload.userId });
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user, // { email, role, userId }
        isAuthenticated: !!token,
        loading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};