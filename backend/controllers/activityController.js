const ActivityLog = require("../Models/ActivityLog");
const User = require("../Models/User");

/* ========== ACTIVITY LOG CONTROLLERS ========== */

// GET /users/me/activities - Get current user's activities
exports.getMyActivities = async (req, res) => {
  try {
    const { page = 1, limit = 20, action, status } = req.query;

    const query = { userId: req.user.id };

    if (action) {
      query.action = action;
    }

    if (status) {
      query.status = status;
    }

    const activities = await ActivityLog.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .lean();

    const total = await ActivityLog.countDocuments(query);

    res.json({
      ok: true,
      activities,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("getMyActivities error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /users/me/activities/summary - Get activity summary
exports.getMyActivitySummary = async (req, res) => {
  try {
    const { days = 30 } = req.query;

    const summary = await ActivityLog.getUserSummary(
      req.user.id,
      parseInt(days)
    );

    const total = await ActivityLog.countDocuments({ userId: req.user.id });

    res.json({
      ok: true,
      summary,
      totalActivities: total,
      period: `Last ${days} days`,
    });
  } catch (error) {
    console.error("getMyActivitySummary error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /admin/activities - Get all activities (admin only)
exports.getAllActivities = async (req, res) => {
  try {
    const { page = 1, limit = 50, userId, action, status } = req.query;

    const query = {};

    if (userId) {
      query.userId = userId;
    }

    if (action) {
      query.action = action;
    }

    if (status) {
      query.status = status;
    }

    const activities = await ActivityLog.find(query)
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .lean();

    const total = await ActivityLog.countDocuments(query);

    res.json({
      ok: true,
      activities,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("getAllActivities error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /admin/activities/stats - Get activity statistics
exports.getActivityStats = async (req, res) => {
  try {
    const { days = 7 } = req.query;

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));

    // Activity by type
    const activityByType = await ActivityLog.aggregate([
      { $match: { createdAt: { $gte: cutoffDate } } },
      { $group: { _id: "$action", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Activity by status
    const activityByStatus = await ActivityLog.aggregate([
      { $match: { createdAt: { $gte: cutoffDate } } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // Most active users
    const mostActiveUsers = await ActivityLog.aggregate([
      { $match: { createdAt: { $gte: cutoffDate } } },
      { $group: { _id: "$userId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          count: 1,
          name: "$user.name",
          email: "$user.email",
        },
      },
    ]);

    // Activity by day
    const activityByDay = await ActivityLog.aggregate([
      { $match: { createdAt: { $gte: cutoffDate } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const totalActivities = await ActivityLog.countDocuments({
      createdAt: { $gte: cutoffDate },
    });

    res.json({
      ok: true,
      stats: {
        totalActivities,
        activityByType,
        activityByStatus,
        mostActiveUsers,
        activityByDay,
      },
      period: `Last ${days} days`,
    });
  } catch (error) {
    console.error("getActivityStats error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /admin/activities/cleanup - Cleanup old logs
exports.cleanupOldLogs = async (req, res) => {
  try {
    const { days = 90 } = req.body;

    const deletedCount = await ActivityLog.cleanupOldLogs(parseInt(days));

    res.json({
      ok: true,
      message: `Deleted ${deletedCount} old activity logs`,
      deletedCount,
    });
  } catch (error) {
    console.error("cleanupOldLogs error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /admin/users/:userId/activities - Get specific user's activities (admin)
exports.getUserActivities = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const activities = await ActivityLog.find({ userId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .lean();

    const total = await ActivityLog.countDocuments({ userId });

    res.json({
      ok: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      activities,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("getUserActivities error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
