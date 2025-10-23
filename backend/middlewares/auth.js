const jwt = require("jsonwebtoken");

/**
 * Middleware to verify JWT token
 * Extracts token from Authorization header: "Bearer <token>"
 * Attaches user data to req.user
 */
const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access denied. No token provided.",
      });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // Attach user info to request
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired. Please refresh your token.",
      });
    }

    return res.status(401).json({
      message: "Invalid token.",
    });
  }
};

module.exports = auth;
