const Log = require('../Models/Log');


const logActivity = async (req, res, next) => {
  try {
    // Lưu log chỉ khi có user đăng nhập (JWT đã xác thực)
    if (req.user) {
      await Log.create({
        userId: req.user._id,
        action: `${req.method} ${req.originalUrl}`,
        ip: req.ip,
        userAgent: req.headers['user-agent']
      });
    }
    next();
  } catch (error) {
    console.error("Log error:", error);
    next();
  }
};

module.exports = logActivity;
