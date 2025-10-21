import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ children, requiredRole, allowedRoles }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  // Nếu chưa đăng nhập, chuyển về trang login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Kiểm tra requiredRole (backward compatibility)
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  
  // Kiểm tra allowedRoles (support multiple roles)
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}