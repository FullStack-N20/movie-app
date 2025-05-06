import Joi from 'joi';

const createMovieSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow(''),
  release_year: Joi.number().integer().optional(),
});

const updateMovieSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().allow('').optional(),
  release_year: Joi.number().integer().optional(),
});

export { createMovieSchema, updateMovieSchema };
