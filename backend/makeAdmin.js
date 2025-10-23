/**
 * Script to make a user an admin
 * Usage: node makeAdmin.js <email>
 * Example: node makeAdmin.js thanhtoa@gmail.com
 */

const mongoose = require("mongoose");
const User = require("./Models/User");
require("dotenv").config();

const makeAdmin = async (email) => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.error(`❌ User not found: ${email}`);
      process.exit(1);
    }

    // Update role to admin
    user.role = "admin";
    await user.save();

    console.log(`✅ User ${user.email} is now an ADMIN!`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   ID: ${user._id}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  console.error("❌ Please provide an email address");
  console.log("Usage: node makeAdmin.js <email>");
  console.log("Example: node makeAdmin.js thanhtoa@gmail.com");
  process.exit(1);
}

makeAdmin(email);
