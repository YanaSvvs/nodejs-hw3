import Joi from 'joi';
import { Types } from 'mongoose';
import { TAGS } from '../constants/tags.js';
import { Segments } from 'celebrate'; 

const isValidObjectId = (value, helpers) => {
    if (!Types.ObjectId.isValid(value)) {
        return helpers.error('any.invalid');
    }
    return value;
};

export const noteIdParamsSchema = Joi.object({
    noteId: Joi.string()
        .custom(isValidObjectId, 'Mongoose ID validation')
        .required()
        .messages({
            'any.required': 'noteId is required in parameters',
            'any.invalid': 'Invalid note ID format',
            'string.base': 'noteId must be a string',
        }),
}); 

export const noteIdSchema = Joi.object({
    [Segments.PARAMS]: noteIdParamsSchema,
}); 

export const createNoteSchema = Joi.object({
    title: Joi.string().min(1).required().messages({
        'string.base': 'Title must be a string',
        'string.min': 'Title should have at least 1 character(s)',
        'any.required': 'Title is required',
    }),
    content: Joi.string().allow('').messages({
        'string.base': 'Content must be a string',
    }),
    tag: Joi.string().valid(...TAGS).messages({
        'string.base': 'Tag must be a string',
        'any.only': `Tag must be one of [${TAGS.join(', ')}]`,
    }),
}).required();

export const createNoteFullSchema = Joi.object({
    [Segments.BODY]: createNoteSchema,
}); 

export const updateNoteBodySchema = Joi.object({
    title: Joi.string().min(1).messages({
        'string.base': 'Title must be a string',
        'string.min': 'Title should have at least 1 character(s)',
    }),
    content: Joi.string().allow('').messages({
        'string.base': 'Content must be a string',
    }),
    tag: Joi.string().valid(...TAGS).messages({
        'string.base': 'Tag must be a string',
        'any.only': `Tag must be one of [${TAGS.join(', ')}]`,
    }),
}).min(1).required().messages({
    'object.min': 'Request body must contain at least one field to update',
});

export const updateNoteSchema = Joi.object({
    [Segments.PARAMS]: noteIdParamsSchema, 
    [Segments.BODY]: updateNoteBodySchema,
});

export const getAllNotesSchema = Joi.object({
    [Segments.QUERY]: Joi.object({
        page: Joi.number().integer().min(1).default(1).messages({
            'number.base': 'Page must be a number',
            'number.integer': 'Page must be an integer',
            'number.min': 'Page must be greater than or equal to 1',
        }),
        perPage: Joi.number().integer().min(5).max(20).default(10).messages({
            'number.base': 'Per Page must be a number',
            'number.integer': 'Per Page must be an integer',
            'number.min': 'Per Page must be greater than or equal to 5',
            'number.max': 'Per Page must be less than or equal to 20',
        }),
        tag: Joi.string().valid(...TAGS).messages({
            'string.base': 'Tag must be a string',
            'any.only': `Tag must be one of [${TAGS.join(', ')}]`,
        }),
        search: Joi.string().allow('').messages({
            'string.base': 'Search query must be a string',
        }),
    }),
});