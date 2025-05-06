import nodemailer from 'nodemailer';
import logger from './logger.js';

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendOTPEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Your OTP Code',
      html: `
        <h1>Your OTP Code</h1>
        <p>Your OTP code is: <strong>${otp}</strong></p>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`OTP email sent to ${email}`, { messageId: info.messageId });
    return info;
  } catch (error) {
    logger.error('Failed to send OTP email', { error: error.message, email });
    throw new Error('Failed to send OTP email');
  }
};
