/**
 * Script tạo Admin User cho RBAC testing
 * Chạy: node makeAdmin.js
 */

const mongoose = require("mongoose");
const User = require("./Models/User");
require("dotenv").config();

const createAdmin = async () => {
  try {
    // Kết nối MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");

    // Kiểm tra admin đã tồn tại chưa
    const existingAdmin = await User.findOne({ email: "admin@example.com" });
    if (existingAdmin) {
      console.log("⚠️  Admin already exists:", existingAdmin.email);
      console.log("Role:", existingAdmin.role);
      process.exit(0);
    }

    // Tạo admin user mới
    const admin = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "admin123",
      role: "admin",
    });

    console.log("✅ Admin created successfully!");
    console.log({
      id: admin._id,
      email: admin.email,
      role: admin.role,
    });

    console.log("\n🔐 Thông tin đăng nhập:");
    console.log("   Email: admin@example.com");
    console.log("   Password: admin123");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating admin:", err.message);
    process.exit(1);
  }
};

createAdmin();
