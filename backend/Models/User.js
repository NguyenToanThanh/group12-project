const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, unique: true, required: true, index: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["user", "moderator", "admin"],
      default: "user",
      index: true,
    },

    // Avatar
    avatarUrl: String,
    avatarPublicId: String,
    avatarFormat: String,
    avatarBytes: Number,
    avatarWidth: Number,
    avatarHeight: Number,

    // Password reset
    resetToken: String,
    resetTokenExp: Date,

    // Refresh token
    refreshToken: String,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("User", userSchema);
