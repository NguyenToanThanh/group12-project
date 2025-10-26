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
    role: {
      type: String,
      enum: ["user", "moderator", "admin"],
      default: "user",
    },

    // --- Avatar lưu từ Cloudinary ---
    avatarUrl: { type: String, default: "" }, // link ảnh trên Cloudinary
    avatarPublicId: { type: String, default: "" }, // id để xóa / cập nhật
    avatarFormat: { type: String, default: "" }, // định dạng (jpg/png/webp)
    avatarBytes: { type: Number, default: 0 }, // dung lượng ảnh (bytes)
    avatarWidth: { type: Number, default: 0 }, // chiều rộng
    avatarHeight: { type: Number, default: 0 }, // chiều cao

    // --- Token đặt lại mật khẩu ---
    resetToken: { type: String, default: null },
    resetTokenExp: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
