const multer = require("multer");

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  const ok = ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(
    file.mimetype
  );
  cb(ok ? null : new Error("Chỉ chấp nhận file ảnh"), ok);
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});
