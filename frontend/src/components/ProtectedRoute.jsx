import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  // Nếu chưa đăng nhập, chuyển về trang login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Nếu yêu cầu role cụ thể và user không có role đó, chuyển về trang chủ
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}