import Joi from 'joi';

const admin = Joi.object({
  username: Joi.string().min(4).max(20).required(),
  password: Joi.string().min(8).max(25).required(),
});

export const adminValidator = (data) => {
  return admin.validate(data);
};
