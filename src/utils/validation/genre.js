import Joi from 'joi';

const createGenreSchema = Joi.object({
  name: Joi.string().required(),
});

export { createGenreSchema };
