const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

exports.adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admin only" });
  }
  next();
};

// Middleware linh hoạt kiểm tra nhiều roles
exports.checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Forbidden: Requires one of roles: ${allowedRoles.join(", ")}`,
      });
    }

    next();
  };
};
