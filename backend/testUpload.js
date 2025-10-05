require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

(async () => {
  try {
    // Kiểm tra xem file có tồn tại không
    if (!fs.existsSync('./test.jpg')) {
      throw new Error('Không tìm thấy file test.jpg trong thư mục backend');
    }

    console.log('📤 Đang upload ảnh test.jpg lên Cloudinary...');
    const result = await cloudinary.uploader.upload('./test.jpg', {
      folder: 'avatars',
    });

    console.log('✅ Ảnh đã upload thành công!');
    console.log('🔗 Link:', result.secure_url);
  } catch (err) {
    console.error('❌ Lỗi upload chi tiết:', err);
  }
})();
