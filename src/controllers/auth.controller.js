import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateOTP, sendOTPEmail } from '../utils/otp.js';
import {
  generateAccessToken,
  generateRefreshToken,
} from '../utils/generate-token.js';

export class AuthController {
  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const existing = await User.findOne({ email });
      if (existing)
        return res.status(400).json({ message: 'Email already registered' });
      const password_hash = await bcrypt.hash(password, 10);
      const otp = generateOTP();
      const otp_expiry = new Date(Date.now() + 10 * 60 * 1000);
      await User.create({
        name,
        email,
        password_hash,
        otp,
        otp_expiry,
      });
      sendOTPEmail(email, otp);
      res.status(201).json({ message: 'User registered. OTP sent to email.' });
    } catch (err) {
      next(err);
    }
  }

  async verifyRegisterOTP(req, res, next) {
    try {
      const { email, otp } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: 'User not found' });
      if (user.is_verified)
        return res.status(400).json({ message: 'Already verified' });
      if (user.otp !== otp || user.otp_expiry < new Date()) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
      }
      user.is_verified = true;
      user.otp = undefined;
      user.otp_expiry = undefined;
      await user.save();
      res.json({ message: 'User verified. You can now log in.' });
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: 'User not found' });
      if (!user.is_verified)
        return res.status(400).json({ message: 'User not verified' });
      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid)
        return res.status(400).json({ message: 'Invalid credentials' });
      const otp = generateOTP();
      user.otp = otp;
      user.otp_expiry = new Date(Date.now() + 10 * 60 * 1000);
      await user.save();
      sendOTPEmail(email, otp);
      res.json({ message: 'OTP sent to email.' });
    } catch (err) {
      next(err);
    }
  }

  async verifyLoginOTP(req, res, next) {
    try {
      const { email, otp } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: 'User not found' });
      if (user.otp !== otp || user.otp_expiry < new Date()) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
      }
      user.otp = undefined;
      user.otp_expiry = undefined;
      await user.save();
      const payload = { userId: user.id, email: user.email}
      const token = generateAccessToken(payload)
      res.json({ token });
    } catch (err) {
      next(err);
    }
  }
}
