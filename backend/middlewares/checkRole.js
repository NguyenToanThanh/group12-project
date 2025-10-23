/**
 * Middleware to check user role
 * Usage: checkRole('admin') or checkRole('admin', 'moderator')
 * @param {...String} allowedRoles - Roles that are allowed to access the route
 * @returns {Function} - Express middleware
 */
const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if user is authenticated (from auth middleware)
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    // Check if user role is in allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied: insufficient permissions",
        requiredRoles: allowedRoles,
        yourRole: req.user.role,
      });
    }

    next();
  };
};

module.exports = checkRole;
