const express = require('express');
const connectDB = require('./connect');
require('dotenv').config();

const app = express();
app.use(express.json());

// Gọi hàm kết nối MongoDB
connectDB();

// Routes
const userRoutes = require('./routes/user');
app.use(userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
