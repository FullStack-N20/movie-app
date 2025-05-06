import jwt from 'jsonwebtoken';
import { createError } from '../utils/error-response.js';

const jwtAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null;

    if (!token) {
      throw createError(401, 'Authentication required');
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY, {
      algorithms: ['HS256'],
      issuer: process.env.JWT_ISSUER,
      maxAge: process.env.JWT_EXPIRES_IN,
    });

    if (!decoded.userId || !decoded.role) {
      throw createError(401, 'Invalid token payload');
    }

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
      email: decoded.email,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw createError(401, 'Token expired');
    }

    if (error instanceof jwt.JsonWebTokenError) {
      throw createError(401, 'Invalid token');
    }

    throw error;
  }
};

export default jwtAuth;
