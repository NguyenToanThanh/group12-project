const User = require("../Models/User");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../utils/cloudinary");
const { logActivity } = require("../middlewares/activityLogger");

/* ========== AVATAR UPLOAD ========== */

// POST /users/avatar - Upload avatar
exports.uploadAvatar = async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if file exists
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete old avatar from Cloudinary if exists
    if (user.avatarPublicId) {
      try {
        await deleteFromCloudinary(user.avatarPublicId);
      } catch (error) {
        console.error("Failed to delete old avatar:", error);
        // Continue anyway
      }
    }

    // Upload new avatar to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, "avatars");

    // Update user with new avatar info
    user.avatar = result.secure_url;
    user.avatarPublicId = result.public_id;
    await user.save();

    // Log activity
    await logActivity(userId, "avatar_upload", {
      description: "User uploaded new avatar",
      status: "success",
      metadata: { publicId: result.public_id },
      req,
    });

    res.json({
      message: "Avatar uploaded successfully",
      avatar: {
        url: user.avatar,
        publicId: user.avatarPublicId,
      },
    });
  } catch (error) {
    console.error("Avatar upload error:", error);

    // Log failed activity
    await logActivity(req.user.id, "avatar_upload", {
      description: "Failed to upload avatar",
      status: "failed",
      metadata: { error: error.message },
      req,
    });

    res.status(500).json({
      message: "Failed to upload avatar",
      error: error.message,
    });
  }
};

// DELETE /users/avatar - Delete avatar
exports.deleteAvatar = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user has avatar
    if (!user.avatar || !user.avatarPublicId) {
      return res.status(404).json({ message: "No avatar to delete" });
    }

    const oldPublicId = user.avatarPublicId;

    // Delete from Cloudinary
    try {
      await deleteFromCloudinary(user.avatarPublicId);
    } catch (error) {
      console.error("Failed to delete from Cloudinary:", error);
      // Continue to remove from database anyway
    }

    // Remove avatar from user
    user.avatar = null;
    user.avatarPublicId = null;
    await user.save();

    // Log activity
    await logActivity(userId, "profile_update", {
      description: "User deleted avatar",
      status: "success",
      metadata: { deletedPublicId: oldPublicId },
      req,
    });

    res.json({ message: "Avatar deleted successfully" });
  } catch (error) {
    console.error("Avatar delete error:", error);

    // Log failed activity
    await logActivity(req.user.id, "profile_update", {
      description: "Failed to delete avatar",
      status: "failed",
      metadata: { error: error.message },
      req,
    });

    res.status(500).json({
      message: "Failed to delete avatar",
      error: error.message,
    });
  }
};

// GET /users/me - Get current user with avatar
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -refreshToken"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
