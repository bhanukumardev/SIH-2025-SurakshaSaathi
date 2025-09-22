const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendPasswordResetEmail(email, resetToken) {
  const frontendBase = process.env.FRONTEND_BASE || 'http://localhost:3001';
  const resetUrl = `${frontendBase.replace(/\/$/, '')}/reset-password?token=${resetToken}`;
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Password Reset',
    text: `Click the link to reset your password: ${resetUrl}`,
    html: `<p>Click the link to reset your password: <a href="${resetUrl}">Reset Password</a></p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent to', email);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

module.exports = {
  sendPasswordResetEmail,
};
