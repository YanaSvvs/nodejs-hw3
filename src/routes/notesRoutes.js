import { Router } from 'express';
import createHttpError from 'http-errors'; 

const validationHandler = (schema, targetGetter) => (req, res, next) => {
    const { error } = schema.validate(targetGetter(req), { abortEarly: false }); 
    if (error) {
        const message = error.details.map(detail => detail.message.replace(/"/g, '')).join('; ');
        return next(createHttpError(400, `Validation failed: ${message}`));
    }
    next();
};

const validateBody = (schema) => validationHandler(schema, req => req.body);
const validateQuery = (schema) => validationHandler(schema, req => req.query);
const validateParams = (schema) => validationHandler(schema, req => req.params);

import {
 getAllNotes, getNoteById, createNote, updateNote, deleteNote,
} from '../controllers/notesController.js';
import {
 getAllNotesQuerySchema, 
noteIdParamsSchema, 
createNoteSchema, 
 updateNoteBodySchema, 
} from '../validations/notesValidation.js'; 
import { authenticate } from '../middleware/authenticate.js'; 

const router = Router();
router.use(authenticate); 
router.get(
'/notes',
 validateQuery(getAllNotesQuerySchema), 
getAllNotes,
);

router.post(
 '/notes',
validateBody(createNoteSchema), 
createNote,
);

router.get(
 '/notes/:noteId',
 validateParams(noteIdParamsSchema), 
getNoteById,
);

router.patch(
 '/notes/:noteId',
    validateParams(noteIdParamsSchema), 
validateBody(updateNoteBodySchema), 
updateNote,
);

router.delete(
'/notes/:noteId',
validateParams(noteIdParamsSchema), 
deleteNote,
);
export default router;
