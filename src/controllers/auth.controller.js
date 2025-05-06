import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import { generateOTP, sendOTPEmail } from '../utils/otp.js';
import {
  generateAccessToken,
  generateRefreshToken,
} from '../utils/generate-token.js';

export class AuthController {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          status: 'error',
          message: 'Name, email and password are required',
          statusCode: 400,
        });
      }

      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(409).json({
          status: 'error',
          message: 'Email already registered',
          statusCode: 409,
        });
      }

      const password_hash = await bcrypt.hash(password, 10);
      const otp = generateOTP();
      const otp_expiry = new Date(Date.now() + 10 * 60 * 1000);

      const user = await User.create({
        name,
        email,
        password_hash,
        otp,
        otp_expiry,
      });

      await sendOTPEmail(email, otp);

      return res.status(201).json({
        status: 'success',
        message: 'User registered successfully. OTP sent to email.',
        data: { userId: user._id, email: user.email },
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: error.message,
      });
    }
  }

  async verifyRegisterOTP(req, res) {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return res.status(400).json({
          status: 'error',
          message: 'Email and OTP are required',
          statusCode: 400,
        });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found',
          statusCode: 404,
        });
      }

      if (user.is_verified) {
        return res.status(400).json({
          status: 'error',
          message: 'User already verified',
          statusCode: 400,
        });
      }

      if (user.otp !== otp || user.otp_expiry < new Date()) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid or expired OTP',
          statusCode: 400,
        });
      }

      user.is_verified = true;
      user.otp = undefined;
      user.otp_expiry = undefined;
      await user.save();

      return res.status(200).json({
        status: 'success',
        message: 'User verified successfully. You can now log in.',
        data: { userId: user._id, email: user.email },
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: error.message,
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          status: 'error',
          message: 'Email and password are required',
          statusCode: 400,
        });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found',
          statusCode: 404,
        });
      }

      if (!user.is_verified) {
        return res.status(403).json({
          status: 'error',
          message: 'Please verify your email first',
          statusCode: 403,
        });
      }

      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid credentials',
          statusCode: 401,
        });
      }

      const otp = generateOTP();
      user.otp = otp;
      user.otp_expiry = new Date(Date.now() + 10 * 60 * 1000);
      await user.save();

      await sendOTPEmail(email, otp);

      return res.status(200).json({
        status: 'success',
        message: 'OTP sent to email',
        data: { email: user.email },
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: error.message,
      });
    }
  }

  async verifyLoginOTP(req, res) {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return res.status(400).json({
          status: 'error',
          message: 'Email and OTP are required',
          statusCode: 400,
        });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found',
          statusCode: 404,
        });
      }

      if (user.otp !== otp || user.otp_expiry < new Date()) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid or expired OTP',
          statusCode: 400,
        });
      }

      user.otp = undefined;
      user.otp_expiry = undefined;
      await user.save();

      const payload = { userId: user._id, email: user.email };
      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 
      });

      return res.status(200).json({
        status: 'success',
        message: 'Login successful',
        data: {
          accessToken,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
          },
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: error.message,
      });
    }
  }
}
