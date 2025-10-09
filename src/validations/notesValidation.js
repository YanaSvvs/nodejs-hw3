
import Joi from 'joi';
import { Types } from 'mongoose'; 
import { TAGS } from '../constants/tags.js'; 

const isValidObjectId = (value, helpers) => {
  if (!Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
};

export const noteIdSchema = Joi.object({
  noteId: Joi.string().custom(isValidObjectId, 'Mongoose ID validation').required().messages({
    'any.required': 'noteId is required in parameters',
    'any.invalid': 'noteId must be a valid Mongoose ObjectId',
  }),
});

export const getAllNotesSchema = Joi.object({
 
  page: Joi.number().integer().min(1).default(1).messages({
    'number.base': 'Page must be a number',
    'number.min': 'Page must be greater than or equal to 1',
  }),
  perPage: Joi.number().integer().min(5).max(20).default(10).messages({
    'number.base': 'Per Page must be a number',
    'number.min': 'Per Page must be greater than or equal to 5',
    'number.max': 'Per Page must be less than or equal to 20',
  }),
  
  tag: Joi.string().valid(...TAGS), 
  search: Joi.string().allow(''), 
});

export const createNoteSchema = Joi.object({
  title: Joi.string().min(1).required(),
  content: Joi.string().allow(''),
  tag: Joi.string().valid(...TAGS).default('Todo'), 
});

export const updateNoteSchema = Joi.object({
  title: Joi.string().min(1),
  content: Joi.string().allow(''),
  tag: Joi.string().valid(...TAGS),
}).min(1); 

