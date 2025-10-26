const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const sendEmail = require("./utils/sendEmail");

console.log("Email User:", process.env.EMAIL_USER);
console.log("Email Pass:", process.env.EMAIL_PASS ? "Loaded" : "Missing");

sendEmail(
  "email_nhan_thu@gmail.com", // thay bằng Gmail bạn muốn nhận
  "Test Nodemailer",
  "<h3>Xin chào, email test gửi thành công!</h3>"
);
