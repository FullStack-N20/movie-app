import { createError } from '../utils/error-response.js';
import logger from '../utils/logger.js';

const validate = (schema, part = 'body') => (req, res, next) => {
  try {
    const { error, value } = schema.validate(req[part], {
      abortEarly: false,
      stripUnknown: true,
      allowUnknown: false,
      convert: true
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
        type: detail.type
      }));

      logger.warn('Validation failed', {
        path: req.path,
        method: req.method,
        errors
      });

      throw createError(400, 'Validation failed', { errors });
    }

    req.validatedData = value;
    next();
  } catch (error) {
    next(error);
  }
};

export default validate;
