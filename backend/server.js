// backend/server.js
const express = require('express');
const dotenv = require('dotenv'); dotenv.config();
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// 1) Kết nối MongoDB Atlas qua MONGODB_URI
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Mongo error:', err));

// 2) Đăng ký routes (như bạn đã làm ở HĐ3)
const userRoutes = require('./routes/user');
app.use(userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
