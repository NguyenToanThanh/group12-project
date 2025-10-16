const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Missing token" });
  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = payload; // {id, role}
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
