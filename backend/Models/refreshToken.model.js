const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  token: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

// ✅ Tránh lỗi “Cannot overwrite model once compiled”
module.exports =
  mongoose.models.RefreshToken ||
  mongoose.model('RefreshToken', refreshTokenSchema);
