const User = require("../Models/User");
const crypto = require("crypto");
const {
  sendPasswordResetEmail,
  sendPasswordResetSuccessEmail,
} = require("../utils/mailer");
const { logActivity } = require("../middlewares/activityLogger");

/**
 * @route   POST /auth/forgot-password
 * @desc    Request password reset email
 * @access  Public
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Validation
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide an email address",
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    // Always return success to prevent email enumeration
    // Don't reveal if email exists or not
    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If that email exists, a password reset link has been sent",
      });
    }

    // Generate reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    try {
      // Send email
      console.log("Attempting to send email to:", user.email);
      console.log("Reset token:", resetToken);
      await sendPasswordResetEmail({
        to: user.email,
        resetToken,
        userName: user.name,
      });

      // Log activity
      await logActivity(user._id, "password_reset_request", {
        description: `Password reset requested for ${user.email}`,
        status: "success",
        req,
      });

      res.status(200).json({
        success: true,
        message: "Password reset email sent successfully",
        // For development/testing only - remove in production
        ...(process.env.NODE_ENV === "development" && { resetToken }),
      });
    } catch (error) {
      // If email fails, clear reset token
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save({ validateBeforeSave: false });

      // Log failed activity
      await logActivity(user._id, "password_reset_request", {
        description: "Failed to send password reset email",
        status: "failure",
        metadata: { error: error.message },
        req,
      });

      console.error("Email sending error:", error);
      console.error("Full error details:", error);
      return res.status(500).json({
        success: false,
        message: "Error sending email. Please try again later.",
      });
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

/**
 * @route   POST /auth/reset-password/:token
 * @desc    Reset password with token
 * @access  Public
 */
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Validation
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Please provide a new password",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Hash the token from URL
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }, // Token not expired
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    // Update password
    user.password = password; // Will be hashed by pre-save middleware
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.refreshToken = undefined; // Invalidate old refresh tokens
    await user.save();

    // Log activity
    await logActivity(user._id, "password_reset_success", {
      description: `Password reset completed for ${user.email}`,
      status: "success",
      req,
    });

    // Send success notification email (optional, non-blocking)
    sendPasswordResetSuccessEmail({
      to: user.email,
      userName: user.name,
    }).catch((err) => console.error("Success email error:", err));

    res.status(200).json({
      success: true,
      message:
        "Password reset successful. You can now login with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

module.exports = {
  forgotPassword,
  resetPassword,
};