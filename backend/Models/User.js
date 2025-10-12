const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    avatarUrl: String,
    avatarPublicId: String,
    avatarFormat: String,
    avatarBytes: Number,
    avatarWidth: Number,
    avatarHeight: Number,
    resetToken: String,
    resetTokenExp: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
