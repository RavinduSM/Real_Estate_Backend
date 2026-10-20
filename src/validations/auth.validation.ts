import Joi from 'joi';

export interface RegisterInput {
  organizationName: string;
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

// Password should be at least 8 characters with a letter and a number.
export const passwordRule = Joi.string()
  .min(8)
  .pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/)
  .messages({
    'string.pattern.base': 'Password must contain at least one letter and one number',
    'string.min': 'Password must be at least 8 characters',
  });

export const registerSchema = Joi.object<RegisterInput>({
  organizationName: Joi.string().trim().min(2).max(100).required(),
  name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().trim().lowercase().email().required(),
  password: passwordRule.required(),
});

export const loginSchema = Joi.object<LoginInput>({
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().required(),
});

