const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Gmail của bạn
        pass: process.env.EMAIL_PASS, // App password (chứ không phải mật khẩu Gmail thường)
      },
    });

    const mailOptions = {
      from: `"Group 12 App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully!");
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};

module.exports = sendEmail;
