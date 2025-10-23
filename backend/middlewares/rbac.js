/**
 * RBAC (Role-Based Access Control) Middleware
 * Middleware để kiểm tra quyền truy cập dựa trên role
 */

/**
 * Check if user has required role(s)
 * @param {string|string[]} roles - Required role(s) (string or array)
 * @returns {Function} Express middleware
 *
 * @example
 * // Single role
 * router.delete('/users/:id', verifyToken, checkRole('admin'), deleteUser);
 *
 * // Multiple roles (admin OR moderator)
 * router.get('/reports', verifyToken, checkRole(['admin', 'moderator']), getReports);
 */
const checkRole = (roles) => {
  return (req, res, next) => {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
        error: "No user found in request. Please login first.",
      });
    }

    // Convert single role to array for consistency
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    // Check if user's role is in allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied. Insufficient permissions.",
        requiredRoles: allowedRoles,
        yourRole: req.user.role,
        error: `This endpoint requires one of the following roles: ${allowedRoles.join(
          ", "
        )}`,
      });
    }

    // User has required role, proceed
    next();
  };
};

/**
 * Check if user is admin
 * Shorthand for checkRole('admin')
 */
const checkAdmin = (req, res, next) => {
  return checkRole("admin")(req, res, next);
};

/**
 * Check if user is moderator or admin
 * Shorthand for checkRole(['admin', 'moderator'])
 */
const checkModerator = (req, res, next) => {
  return checkRole(["admin", "moderator"])(req, res, next);
};

/**
 * Check if user is owner of resource OR has elevated role
 * @param {Function} getResourceOwnerId - Function to get owner ID from request
 * @param {string[]} allowedRoles - Roles that can bypass owner check (default: ['admin', 'moderator'])
 *
 * @example
 * // User can only edit their own profile, but admin/moderator can edit any
 * router.put('/users/:id',
 *   verifyToken,
 *   checkOwnerOrRole(
 *     (req) => req.params.id,
 *     ['admin', 'moderator']
 *   ),
 *   updateProfile
 * );
 */
const checkOwnerOrRole = (
  getResourceOwnerId,
  allowedRoles = ["admin", "moderator"]
) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Check if user has elevated role
    if (allowedRoles.includes(req.user.role)) {
      return next();
    }

    // Check if user is owner
    const resourceOwnerId = getResourceOwnerId(req);
    if (
      req.user.id === resourceOwnerId ||
      req.user.id === resourceOwnerId.toString()
    ) {
      return next();
    }

    // Not owner and no elevated role
    return res.status(403).json({
      message: "Access denied. You can only access your own resources.",
      error:
        "You are not the owner of this resource and don't have elevated permissions.",
    });
  };
};

module.exports = {
  checkRole,
  checkAdmin,
  checkModerator,
  checkOwnerOrRole,
};
