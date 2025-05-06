import joi from 'joi';
import jwt from 'jsonwebtoken';
import { MongoError } from 'mongodb';
import logger from '../utils/logger.js';

const errorHandler = (err, req, res) => {
  const timestamp = new Date().toISOString();
  const requestId = req.id || 'unknown';

  let statusCode = 500;
  let message = 'Internal Server Error';
  let errorDetails = {};

  if (err instanceof joi.ValidationError) {
    statusCode = 400;
    message = 'Validation Error';
    errorDetails = err.details.map((detail) => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));
  } else if (err instanceof jwt.JsonWebTokenError) {
    statusCode = 401;
    message = 'Invalid Token';
  } else if (err instanceof MongoError) {
    if (err.code === 11000) {
      statusCode = 409;
      message = 'Duplicate Entry';
      errorDetails = { field: Object.keys(err.keyPattern)[0] };
    }
  } else if (err.statusCode) {
    statusCode = err.statusCode;
    message = err.message;
  }

  const logData = {
    timestamp,
    requestId,
    method: req.method,
    path: req.path,
    statusCode,
    message,
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    userAgent: req.get('user-agent'),
    ip: req.ip,
  };

  logger.error(logData);

  return res.status(statusCode).json({
    status: 'error',
    message,
    ...(errorDetails && { errors: errorDetails }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    statusCode,
    requestId,
  });
};

export default errorHandler;
