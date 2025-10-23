const rateLimit = require("express-rate-limit");
const slowDown = require("express-slow-down");

// Strict rate limiting for login endpoint
// 5 attempts per 15 minutes
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per windowMs
  message: {
    message:
      "Too many login attempts from this IP, please try again after 15 minutes.",
    retryAfter: "15 minutes",
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  skipSuccessfulRequests: true, // Don't count successful logins
  // Custom handler for rate limit exceeded
  handler: (req, res) => {
    console.log(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      message: "Too many login attempts. Please try again after 15 minutes.",
      retryAfter: "15 minutes",
    });
  },
});

// Slow down repeated signup attempts
// Start slowing down after 3 requests
const signupSpeedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 3, // Allow 3 requests per 15 minutes at full speed
  delayMs: (hits) => hits * 1000, // Add 1 second delay per request after delayAfter
  maxDelayMs: 10000, // Maximum delay of 10 seconds
});

// Rate limit for signup endpoint
const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 signups per hour
  message: {
    message: "Too many accounts created from this IP, please try again later.",
    retryAfter: "1 hour",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limit for password reset
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit to 3 reset requests per hour
  message: {
    message:
      "Too many password reset requests from this IP, please try again later.",
    retryAfter: "1 hour",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    message: "Too many requests from this IP, please try again later.",
    retryAfter: "15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict limiter for sensitive operations
const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Only 5 requests per hour
  message: {
    message:
      "Too many requests for this operation, please try again after an hour.",
    retryAfter: "1 hour",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  loginLimiter,
  signupLimiter,
  signupSpeedLimiter,
  passwordResetLimiter,
  apiLimiter,
  strictLimiter,
};
