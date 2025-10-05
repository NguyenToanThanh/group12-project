require('dotenv').config();
const mongoose = require('mongoose');
const RefreshToken = require('./refreshToken.model');

(async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 20000,
      family: 4,
    });

    console.log("✅ Kết nối MongoDB thành công");
    console.log("📂 Database hiện tại:", conn.connection.name);
    console.log("📡 Trạng thái kết nối:", conn.connection.readyState);

    // ✅ Thử tạo token mẫu
    const newToken = await RefreshToken.create({
      userId: new mongoose.Types.ObjectId(),
      token: 'refresh_token_demo_001',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    console.log("📦 Đã lưu token:", newToken);

    const found = await RefreshToken.findOne({ token: 'refresh_token_demo_001' });
    console.log("🔎 Đã truy xuất:", found);

    await mongoose.disconnect();
    console.log("🔒 Đã đóng kết nối MongoDB");
  } catch (err) {
    console.error("❌ Lỗi:", err);
  }
})();
