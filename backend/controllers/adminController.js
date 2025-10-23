/**
 * Admin Controller
 * Quản lý user: CRUD operations, role management
 */

const User = require("../Models/User");
const ActivityLog = require("../Models/ActivityLog");
const { deleteFromCloudinary } = require("../utils/cloudinary");
const { logActivity } = require("../middlewares/activityLogger");

/**
 * Get all users with pagination, filtering, and search
 * GET /admin/users
 * Query params: page, limit, role, search, sortBy, sortOrder
 */
exports.getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      role,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build filter query
    const filter = {};
    if (role) {
      filter.role = role;
    }
    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Execute query with pagination
    const users = await User.find(filter)
      .select("-password -refreshToken -resetPasswordToken")
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .lean();

    // Get total count
    const total = await User.countDocuments(filter);

    // Log activity
    await logActivity({
      userId: req.user.id,
      activityType: "admin_user_list",
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
      metadata: {
        filters: { role, search },
        pagination: { page, limit },
        resultsCount: users.length,
      },
    });

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalUsers: total,
          usersPerPage: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
};

/**
 * Get single user details with statistics
 * GET /admin/users/:id
 */
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Get user details
    const user = await User.findById(id)
      .select("-password -refreshToken -resetPasswordToken")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get user statistics
    const [activityStats, recentActivities] = await Promise.all([
      // Activity count by type
      ActivityLog.aggregate([
        { $match: { userId: user._id } },
        {
          $group: {
            _id: "$activityType",
            count: { $sum: 1 },
          },
        },
      ]),

      // Recent 10 activities
      ActivityLog.find({ userId: user._id })
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
    ]);

    // Log activity
    await logActivity({
      userId: req.user.id,
      activityType: "admin_user_view",
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
      metadata: {
        targetUserId: id,
        targetUsername: user.username,
      },
    });

    res.json({
      success: true,
      data: {
        user,
        statistics: {
          totalActivities: recentActivities.length,
          activitiesByType: activityStats.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
          }, {}),
          accountAge: Math.floor(
            (Date.now() - new Date(user.createdAt).getTime()) /
              (1000 * 60 * 60 * 24)
          ),
          isLocked: user.lockUntil && user.lockUntil > Date.now(),
        },
        recentActivities,
      },
    });
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user details",
      error: error.message,
    });
  }
};

/**
 * Update user role
 * PUT /admin/users/:id/role
 * Body: { role: 'user' | 'moderator' | 'admin' }
 */
exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validate role
    const validRoles = ["user", "moderator", "admin"];
    if (!role || !validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
        validRoles,
      });
    }

    // Prevent self role modification
    if (id === req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Cannot modify your own role",
        error:
          "For security reasons, you cannot change your own role. Ask another admin.",
      });
    }

    // Find and update user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const oldRole = user.role;
    user.role = role;
    await user.save();

    // Log activity
    await logActivity({
      userId: req.user.id,
      activityType: "admin_role_update",
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
      metadata: {
        targetUserId: id,
        targetUsername: user.username,
        oldRole,
        newRole: role,
      },
    });

    res.json({
      success: true,
      message: "User role updated successfully",
      data: {
        userId: user._id,
        username: user.username,
        oldRole,
        newRole: role,
      },
    });
  } catch (error) {
    console.error("Update user role error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating user role",
      error: error.message,
    });
  }
};

/**
 * Delete user (soft delete with cleanup)
 * DELETE /admin/users/:id
 */
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent self deletion
    if (id === req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Cannot delete your own account",
        error:
          "For security reasons, you cannot delete yourself. Ask another admin.",
      });
    }

    // Find user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Cleanup user data
    const cleanupTasks = [];

    // 1. Delete avatar from Cloudinary if exists
    if (user.avatarPublicId) {
      cleanupTasks.push(
        deleteFromCloudinary(user.avatarPublicId).catch((err) =>
          console.error("Error deleting avatar:", err)
        )
      );
    }

    // 2. Delete or anonymize activity logs (keep for audit but remove user link)
    cleanupTasks.push(
      ActivityLog.updateMany(
        { userId: user._id },
        {
          $set: {
            userId: null,
            metadata: {
              deletedUser: true,
              originalUsername: user.username,
            },
          },
        }
      )
    );

    // Wait for cleanup
    await Promise.all(cleanupTasks);

    // Log deletion activity BEFORE deleting user
    await logActivity({
      userId: req.user.id,
      activityType: "admin_user_delete",
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
      metadata: {
        deletedUserId: id,
        deletedUsername: user.username,
        deletedUserEmail: user.email,
        deletedUserRole: user.role,
      },
    });

    // Delete user
    await User.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "User deleted successfully",
      data: {
        deletedUserId: id,
        deletedUsername: user.username,
        cleanedUp: {
          avatar: !!user.avatarPublicId,
          activityLogs: true,
        },
      },
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message,
    });
  }
};

/**
 * Get user statistics overview
 * GET /admin/users/stats/overview
 */
exports.getUserStats = async (req, res) => {
  try {
    const [totalUsers, usersByRole, lockedAccounts, recentSignups] =
      await Promise.all([
        // Total users
        User.countDocuments(),

        // Users by role
        User.aggregate([
          {
            $group: {
              _id: "$role",
              count: { $sum: 1 },
            },
          },
        ]),

        // Locked accounts
        User.countDocuments({
          lockUntil: { $gt: new Date() },
        }),

        // Recent signups (last 7 days)
        User.countDocuments({
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        }),
      ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        usersByRole: usersByRole.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        lockedAccounts,
        recentSignups,
        timestamp: new Date(),
      },
    });
  } catch (error) {
    console.error("Get user stats error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user statistics",
      error: error.message,
    });
  }
};
