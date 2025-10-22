const rateLimit = require("express-rate-limit");

exports.loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  message: { message: "Quá nhiều lần đăng nhập, thử lại sau." },
});
