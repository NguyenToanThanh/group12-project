const rateLimit = require("express-rate-limit");

// Rate limiting for login endpoint
exports.loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: {
    message: "Too many login attempts, please try again later.",
    retryAfter: "5 minutes",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// General rate limiter for all endpoints
exports.generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    message: "Too many requests, please try again later.",
    retryAfter: "15 minutes",
  },
});
