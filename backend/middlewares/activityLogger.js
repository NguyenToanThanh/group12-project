const ActivityLog = require("../Models/ActivityLog");

/**
 * Log user activity
 * @param {string} userId - User ID
 * @param {string} action - Action type
 * @param {Object} options - Additional options
 */
const logActivity = async (userId, action, options = {}) => {
  try {
    const {
      description = "",
      ipAddress = null,
      userAgent = null,
      status = "success",
      metadata = {},
      req = null,
    } = options;

    const logData = {
      userId,
      action,
      description,
      ipAddress: ipAddress || (req ? getClientIP(req) : null),
      userAgent: userAgent || (req ? req.get("user-agent") : null),
      status,
      metadata,
    };

    const log = await ActivityLog.create(logData);
    return log;
  } catch (error) {
    console.error("Error logging activity:", error);
    // Don't throw error - logging shouldn't break the app
    return null;
  }
};

/**
 * Middleware to automatically log activity
 * Usage: router.post('/login', logActivityMiddleware('login'), loginController)
 */
const logActivityMiddleware = (action, descriptionFn = null) => {
  return async (req, res, next) => {
    // Store original res.json to intercept response
    const originalJson = res.json.bind(res);

    res.json = function (body) {
      // Log activity after response
      setImmediate(async () => {
        try {
          const userId = req.user?._id || req.body?.userId || body?.user?._id;

          if (userId) {
            const description =
              typeof descriptionFn === "function"
                ? descriptionFn(req, body)
                : descriptionFn || `User performed ${action}`;

            const status =
              res.statusCode >= 200 && res.statusCode < 300
                ? "success"
                : "failure";

            await logActivity(userId, action, {
              description,
              status,
              req,
              metadata: {
                statusCode: res.statusCode,
                method: req.method,
                path: req.path,
              },
            });
          }
        } catch (error) {
          console.error("Error in logActivityMiddleware:", error);
        }
      });

      // Call original json method
      return originalJson(body);
    };

    next();
  };
};

/**
 * Get client IP address
 */
const getClientIP = (req) => {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.headers["x-real-ip"] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.ip ||
    "unknown"
  );
};

/**
 * Helper function to log activity from within controllers
 */
const createActivityLogger = (req) => {
  return {
    log: async (userId, action, options = {}) => {
      return await logActivity(userId, action, {
        ...options,
        req,
      });
    },
  };
};

module.exports = {
  logActivity,
  logActivityMiddleware,
  getClientIP,
  createActivityLogger,
};
