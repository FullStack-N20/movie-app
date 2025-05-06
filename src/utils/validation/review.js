import Joi from 'joi';

const createReviewSchema = Joi.object({
  movie_id: Joi.string().required(),
  content: Joi.string().required(),
  rating: Joi.number().integer().optional(),
});

const updateReviewSchema = Joi.object({
  content: Joi.string().optional(),
  rating: Joi.number().integer().optional(),
});

export { createReviewSchema, updateReviewSchema };
