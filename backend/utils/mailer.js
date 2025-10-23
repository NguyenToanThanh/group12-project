const nodemailer = require("nodemailer");

/**
 * Create email transporter
 * Supports Gmail, Outlook, or custom SMTP
 */
const createTransporter = () => {
  // Check if using Gmail
  if (process.env.EMAIL_SERVICE === "gmail") {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD, // App Password, not regular password
      },
    });
  }

  // Custom SMTP configuration
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

/**
 * Send password reset email
 * @param {Object} options - Email options
 * @param {String} options.to - Recipient email
 * @param {String} options.resetToken - Password reset token
 * @param {String} options.userName - User's name
 */
const sendPasswordResetEmail = async ({ to, resetToken, userName }) => {
  const transporter = createTransporter();

  // Reset URL (frontend URL)
  const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  // Email HTML template
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #4CAF50;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .content {
          background-color: #f9f9f9;
          padding: 30px;
          border-radius: 0 0 5px 5px;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background-color: #4CAF50;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          font-size: 12px;
          color: #666;
        }
        .warning {
          background-color: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 10px;
          margin: 15px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Password Reset Request</h1>
        </div>
        <div class="content">
          <p>Hi <strong>${userName}</strong>,</p>
          
          <p>You requested to reset your password. Click the button below to create a new password:</p>
          
          <center>
            <a href="${resetURL}" class="button">Reset Password</a>
          </center>
          
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #0066cc;">${resetURL}</p>
          
          <div class="warning">
            <strong>⚠️ Important:</strong>
            <ul>
              <li>This link will expire in <strong>10 minutes</strong></li>
              <li>If you didn't request this, please ignore this email</li>
              <li>Your password will remain unchanged until you access the link above</li>
            </ul>
          </div>
          
          <div class="footer">
            <p>This is an automated email. Please do not reply.</p>
            <p>&copy; ${new Date().getFullYear()} Group 12 Project. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  // Plain text version (fallback)
  const textContent = `
    Hi ${userName},

    You requested to reset your password.

    Click this link to reset your password:
    ${resetURL}

    This link will expire in 10 minutes.

    If you didn't request this, please ignore this email.

    - Group 12 Project
  `;

  // Email options
  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME || "Group 12 Project"}" <${
      process.env.EMAIL_USER
    }>`,
    to,
    subject: "Password Reset Request - Group 12 Project",
    text: textContent,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Email error:", error);
    throw new Error("Failed to send email");
  }
};

/**
 * Send password reset success notification
 */
const sendPasswordResetSuccessEmail = async ({ to, userName }) => {
  const transporter = createTransporter();

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
        .success { background-color: #d4edda; border-left: 4px solid #28a745; padding: 10px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Password Reset Successful</h1>
        </div>
        <div class="content">
          <p>Hi <strong>${userName}</strong>,</p>
          
          <div class="success">
            <p><strong>Your password has been successfully changed!</strong></p>
          </div>
          
          <p>You can now log in with your new password.</p>
          
          <p>If you didn't make this change, please contact support immediately.</p>
          
          <p>Best regards,<br>Group 12 Team</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME || "Group 12 Project"}" <${
      process.env.EMAIL_USER
    }>`,
    to,
    subject: "Password Reset Successful - Group 12 Project",
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Success email sent to:", to);
  } catch (error) {
    console.error("❌ Success email error:", error);
  }
};

module.exports = {
  sendPasswordResetEmail,
  sendPasswordResetSuccessEmail,
};
