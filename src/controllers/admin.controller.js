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
      if (error) {
        throw new Error(`Error creating admin ${error}`);
      }

      const { username, password } = value;
      const checkSuperAdmin = await Admin.findOne({ role: 'superAdmin' });
      if (checkSuperAdmin) {
        return res.status(409).json({
          statusCode: 409,
          message: 'SuperAdmin is already exists',
        });
      }
      const hashedPassword = await decode(password, 8);
      const superAdmin = await Admin.create({
        username,
        hashedPassword,
        role: 'superAdmin',
      });

      return res.status(201).send(`Admin successfully created: ${superAdmin}`);
    } catch (e) {
      catchError(e, res);
    }
  }

  async createAdmin(req, res) {
    try {
      const { error, value } = adminValidator(req.body);
      if (error) {
        throw new Error(`Error creating admin ${error}`);
      }

      const { username, password } = value;

      const hashedPassword = await decode(password, 8);
      const newAdmin = await Admin.create({
        username,
        hashedPassword,
        role: 'admin',
      });

      return res.status(201).send(`Admin successfully created: ${newAdmin}`);
    } catch (e) {
      catchError(e, res);
    }
  }

  async getAllAdmins(_, res) {
    try {
      const admins = await Admin.find();
      res.status(200).json({
        statusCode: 200,
        message: 'success',
        data: admins,
      });
    } catch (e) {
      catchError(e);
    }
  }

  async getAdminByID(req, res) {
    try {
      const id = req.params.id;
      const admin = await Admin.findById(id);
      if (!admin) {
        throw new Error('Admin not found');
      }
      res.status(200).send(`Admin's data: ${admin}`);
    } catch (e) {
      catchError(e);
    }
  }

  async updateAdmin(req, res) {
    try {
      const id = req.params.id;
      const admin = await Admin.findById(id);
      if (!admin) {
        throw new Error('Admin not found');
      }
      const updateAdmin = await Admin.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      res.status(200).send(`Admin Successfully updated: ${updateAdmin}`);
    } catch (e) {
      catchError(e);
    }
  }

  async deleteAdmin(req, res) {
    try {
      const id = req.params.id;
      const admin = await Admin.findById(id);
      if (!admin) {
        throw new Error('Admin not found');
      }
      if (admin.role == 'superAdmin') {
        return res.status(400).json({
          statusCode: 400,
          message: 'Cha pa lah',
        });
      }

      await Admin.findByIdAndDelete(id);
      res.status(200).send('Admin successfully delete');
    } catch (e) {
      catchError(e);
    }
  }

  async singIn(req, res) {
    try {
      const { username, password } = req.body;
      const admin = await Admin.findOne({ username });
      if (!admin) {
        console.log(1111);
        throw new Error('Admin not found');
      }

      const isMatchPassword = await encode(password, admin.hashedPassword);
      if (!isMatchPassword) {
        console.log(1111);
        throw new Error('Invalid password');
      }

      const payload = { id: admin._id, role: admin.role };
      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      res.status(200).json({
        statusCode: 200,
        message: 'success',
        data: {
          access: accessToken,
          refresh: refreshToken,
        },
      });
    } catch (e) {
      catchError(e, res);
    }
  }
}
