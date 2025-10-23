const multer = require("multer");
const sharp = require("sharp");

// Configure multer to store files in memory
const storage = multer.memoryStorage();

// File filter - only accept images
const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Multer upload configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

/**
 * Middleware to resize image using Sharp
 * This should be used after multer upload middleware
 */
const resizeImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return next();
    }

    // Resize image to 256x256 using Sharp
    const resizedBuffer = await sharp(req.file.buffer)
      .resize(256, 256, {
        fit: "cover",
        position: "center",
      })
      .jpeg({ quality: 90 })
      .toBuffer();

    // Replace original buffer with resized buffer
    req.file.buffer = resizedBuffer;
    req.file.size = resizedBuffer.length;

    next();
  } catch (error) {
    console.error("Image resize error:", error);
    res.status(400).json({ message: "Failed to process image" });
  }
};

module.exports = {
  upload,
  resizeImage,
};
