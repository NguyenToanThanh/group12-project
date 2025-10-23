const router = require("express").Router();
const verifyToken = require("../middlewares/auth");
const { checkAdmin } = require("../middlewares/rbac");
const {
  getAllActivities,
  getActivityStats,
  cleanupOldLogs,
  getUserActivities,
} = require("../controllers/activityController");
const {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getUserStats,
} = require("../controllers/adminController");

// ==================== ACTIVITY MONITORING ROUTES ====================
router.get("/activities", verifyToken, checkAdmin, getAllActivities);
router.get("/activities/stats", verifyToken, checkAdmin, getActivityStats);
router.delete("/activities/cleanup", verifyToken, checkAdmin, cleanupOldLogs);
router.get(
  "/users/:userId/activities",
  verifyToken,
  checkAdmin,
  getUserActivities
);

// ==================== USER MANAGEMENT ROUTES ====================
// Get user statistics overview
router.get("/users/stats/overview", verifyToken, checkAdmin, getUserStats);

// Get all users with filtering and pagination
router.get("/users", verifyToken, checkAdmin, getAllUsers);

// Get single user details with statistics
router.get("/users/:id", verifyToken, checkAdmin, getUserById);

// Update user role (admin only, cannot change own role)
router.put("/users/:id/role", verifyToken, checkAdmin, updateUserRole);

// Delete user (admin only, cannot delete self)
router.delete("/users/:id", verifyToken, checkAdmin, deleteUser);

module.exports = router;
