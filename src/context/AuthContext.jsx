import { createContext, useContext, useState, useEffect } from 'react';
import authApi from '../API/authApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('auth_token'));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('auth_user');
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMe = async () => {
      if (token && !user) {
        try {
          const res = await authApi.me(); // nếu backend chưa có /me có thể comment
          setUser(res.data);
          localStorage.setItem('auth_user', JSON.stringify(res.data));
        } catch {
          logout();
        }
      }
    };
    fetchMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const signup = async (formData) => {
    setLoading(true);
    try {
      const res = await authApi.signup(formData);
      return { success: true, message: res.data?.message || 'Đăng ký thành công' };
    } catch (err) {
      return { success: false, message: err.message || 'Đăng ký thất bại' };
    } finally {
      setLoading(false);
    }
  };

  const login = async (formData) => {
    setLoading(true);
    try {
      const res = await authApi.login(formData);
      const tk = res.data?.token;
      const usr = res.data?.user;
      if (!tk) return { success: false, message: 'Không nhận được token' };
      setToken(tk);
      setUser(usr);
      localStorage.setItem('auth_token', tk);
      localStorage.setItem('auth_user', JSON.stringify(usr || null));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message || 'Đăng nhập thất bại' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        loading,
        signup,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);