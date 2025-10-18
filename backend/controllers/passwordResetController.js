const crypto = require("crypto");
const User = require("../Models/User");
const {
  sendPasswordResetEmail,
  sendPasswordResetSuccessEmail,
} = require("../utils/mailer");

/* ========== PASSWORD RESET ========== */

// POST /auth/forgot-password - Send password reset email
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Don't reveal if user exists or not (security best practice)
      return res.json({
        message: "If that email exists, a password reset link has been sent",
      });
    }

    // Generate reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Send email
    try {
      console.log("Attempting to send email to:", user.email);
      console.log("Reset token:", resetToken);
      await sendPasswordResetEmail(user.email, resetToken, user.name);

      res.json({
        message: "Password reset link has been sent to your email",
        // For development/testing only - remove in production
        ...(process.env.NODE_ENV === "development" && { resetToken }),
      });
    } catch (emailError) {
      // If email fails, clear reset token
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save({ validateBeforeSave: false });

      console.error("Email error details:", emailError.message);
      console.error("Full error:", emailError);
      return res.status(500).json({
        message: "Failed to send password reset email. Please try again later.",
        error:
          process.env.NODE_ENV === "development"
            ? emailError.message
            : undefined,
      });
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /auth/reset-password/:token - Reset password with token
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        message: "New password is required and must be at least 6 characters",
      });
    }

    // Hash the token from params to compare with database
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }, // Token not expired
    }).select("+resetPasswordToken +resetPasswordExpires");

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset token",
      });
    }

    // Update password
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.refreshToken = undefined; // Invalidate all sessions
    await user.save();

    // Send confirmation email (don't wait for it)
    sendPasswordResetSuccessEmail(user.email, user.name).catch((err) =>
      console.error("Failed to send confirmation email:", err)
    );

    res.json({
      message:
        "Password has been reset successfully. You can now log in with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /auth/verify-reset-token/:token - Verify if reset token is valid
exports.verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;

    // Hash the token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        valid: false,
        message: "Invalid or expired reset token",
      });
    }

    res.json({
      valid: true,
      message: "Token is valid",
      email: user.email, // Can be used to display on reset form
    });
  } catch (error) {
    console.error("Verify reset token error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
