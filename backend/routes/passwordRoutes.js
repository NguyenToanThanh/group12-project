const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const User = require('../models/User');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// ===== Quên mật khẩu =====
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'Email không tồn tại' });

    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1h
    await user.save();

    // cấu hình gửi mail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      to: email,
      from: process.env.EMAIL_USER,
      subject: 'Reset Password',
      text: `Vui lòng truy cập link: http://localhost:3000/reset-password/${token}`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Email đặt lại mật khẩu đã được gửi!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== Đặt lại mật khẩu =====
router.post('/reset-password/:token', async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ error: 'Token không hợp lệ hoặc hết hạn' });

    user.password = await bcrypt.hash(req.body.password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Đặt lại mật khẩu thành công!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// ===== Test route =====
router.get('/test', (req, res) => {
  res.send('Password route OK ✅');
});
module.exports = router;
