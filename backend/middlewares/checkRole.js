/**
 * Middleware to check if user has required role
 * Usage: checkRole('admin') or checkRole(['admin', 'moderator'])
 */
const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Check if user has required role
    const userRole = req.user.role;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${allowedRoles.join(
          " or "
        )}. Your role: ${userRole}`,
      });
    }

    // User has required role, proceed
    next();
  };
};

module.exports = checkRole;
