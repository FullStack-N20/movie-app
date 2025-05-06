import Admin from '../models/admin.model.js';
import { adminValidator } from '../utils/admin-validation.js';
import { catchError } from '../utils/error-response.js';
import { decode, encode } from '../utils/bcrypt-encrypt.js';
import {
  generateAccessToken,
  generateRefreshToken,
} from '../utils/generate-token.js';

export class AdminController {
  async createSuperAdmin(req, res) {
    try {
      const { error, value } = adminValidator(req.body);
      if (error) throw new Error(`Validation error: ${error.message}`);

      const { username, password } = value;
      const existingSuperAdmin = await Admin.findOne({ role: 'superAdmin' });

      if (existingSuperAdmin) {
        return res.status(409).json({
          status: 'error',
          message: 'SuperAdmin already exists',
          statusCode: 409,
        });
      }

      const hashedPassword = await decode(password, 8);
      const superAdmin = await Admin.create({
        username,
        hashedPassword,
        role: 'superAdmin',
      });

      return res.status(201).json({
        status: 'success',
        message: 'SuperAdmin created successfully',
        data: {
          id: superAdmin._id,
          username: superAdmin.username,
          role: superAdmin.role,
        },
      });
    } catch (error) {
      catchError(error, res);
    }
  }

  async createAdmin(req, res) {
    try {
      const { error, value } = adminValidator(req.body);
      if (error) throw new Error(`Validation error: ${error.message}`);

      const { username, password } = value;
      const hashedPassword = await decode(password, 8);

      const newAdmin = await Admin.create({
        username,
        hashedPassword,
        role: 'admin',
      });

      return res.status(201).json({
        status: 'success',
        message: 'Admin created successfully',
        data: {
          id: newAdmin._id,
          username: newAdmin.username,
          role: newAdmin.role,
        },
      });
    } catch (error) {
      catchError(error, res);
    }
  }

  async getAllAdmins(_, res) {
    try {
      const admins = await Admin.find().select('-hashedPassword');

      return res.status(200).json({
        status: 'success',
        message: 'Admins retrieved successfully',
        data: admins,
      });
    } catch (error) {
      catchError(error, res);
    }
  }

  async getAdminByID(req, res) {
    try {
      const { id } = req.params;
      const admin = await Admin.findById(id).select('-hashedPassword');

      if (!admin) {
        return res.status(404).json({
          status: 'error',
          message: 'Admin not found',
          statusCode: 404,
        });
      }

      return res.status(200).json({
        status: 'success',
        message: 'Admin retrieved successfully',
        data: admin,
      });
    } catch (error) {
      catchError(error, res);
    }
  }

  async updateAdmin(req, res) {
    try {
      const { id } = req.params;
      const { error, value } = adminValidator(req.body);
      if (error) throw new Error(`Validation error: ${error.message}`);

      const admin = await Admin.findById(id);
      if (!admin) {
        return res.status(404).json({
          status: 'error',
          message: 'Admin not found',
          statusCode: 404,
        });
      }

      const updatedAdmin = await Admin.findByIdAndUpdate(
        id,
        {
          ...value,
          hashedPassword: value.password
            ? await decode(value.password, 8)
            : undefined,
        },
        { new: true }
      ).select('-hashedPassword');

      return res.status(200).json({
        status: 'success',
        message: 'Admin updated successfully',
        data: updatedAdmin,
      });
    } catch (error) {
      catchError(error, res);
    }
  }

  async deleteAdmin(req, res) {
    try {
      const { id } = req.params;
      const admin = await Admin.findById(id);

      if (!admin) {
        return res.status(404).json({
          status: 'error',
          message: 'Admin not found',
          statusCode: 404,
        });
      }

      if (admin.role === 'superAdmin') {
        return res.status(403).json({
          status: 'error',
          message: 'Cannot delete SuperAdmin account',
          statusCode: 403,
        });
      }

      await Admin.findByIdAndDelete(id);

      return res.status(200).json({
        status: 'success',
        message: 'Admin deleted successfully',
      });
    } catch (error) {
      catchError(error, res);
    }
  }

  async signIn(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          status: 'error',
          message: 'Username and password are required',
          statusCode: 400,
        });
      }

      const admin = await Admin.findOne({ username });
      if (!admin) {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid credentials',
          statusCode: 401,
        });
      }

      const isPasswordValid = await encode(password, admin.hashedPassword);
      if (!isPasswordValid) {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid credentials',
          statusCode: 401,
        });
      }

      const payload = { id: admin._id, role: admin.role };
      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      return res.status(200).json({
        status: 'success',
        message: 'Login successful',
        data: {
          accessToken,
          refreshToken,
          admin: {
            id: admin._id,
            username: admin.username,
            role: admin.role,
          },
        },
      });
    } catch (error) {
      catchError(error, res);
    }
  }
}
