const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        "login",
        "logout",
        "signup",
        "password_reset_request",
        "password_reset_success",
        "profile_update",
        "avatar_upload",
        "avatar_delete",
        "failed_login",
        "account_locked",
        "account_unlocked",
      ],
    },
    description: {
      type: String,
      default: "",
    },
    ipAddress: {
      type: String,
      default: null,
    },
    userAgent: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["success", "failure", "warning"],
      default: "success",
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
activityLogSchema.index({ userId: 1, createdAt: -1 });
activityLogSchema.index({ action: 1 });
activityLogSchema.index({ createdAt: -1 });

// Auto cleanup old logs (older than 90 days)
activityLogSchema.statics.cleanupOldLogs = async function (daysToKeep = 90) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

  const result = await this.deleteMany({
    createdAt: { $lt: cutoffDate },
  });

  return result.deletedCount;
};

// Get user activity summary
activityLogSchema.statics.getUserSummary = async function (userId, days = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return await this.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        createdAt: { $gte: cutoffDate },
      },
    },
    {
      $group: {
        _id: "$action",
        count: { $sum: 1 },
        lastActivity: { $max: "$createdAt" },
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);
};

module.exports = mongoose.model("ActivityLog", activityLogSchema);
