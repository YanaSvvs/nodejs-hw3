import { Router } from 'express';
import { validateBody, validateQuery, validateParams } from '../services/auth.js'; 
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
