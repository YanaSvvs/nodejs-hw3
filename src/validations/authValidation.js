
import Joi from 'joi';

const userCredentialsSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email must be a valid email address.',
    'any.required': 'Email is required.',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required.',
  }),
});

export const registerUserSchema = userCredentialsSchema.clone();

export const loginUserSchema = userCredentialsSchema.clone();

export const requestResetEmailSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email must be a valid email address.',
    'any.required': 'Email is required.',
  }),
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().required().messages({
    'any.required': 'Token is required.',
  }),
  password: Joi.string().required().messages({
    'any.required': 'New password is required.',
  }),
});