import Joi from 'joi';

const likeSchema = Joi.object({
  review_id: Joi.string().required(),
});

export { likeSchema };
