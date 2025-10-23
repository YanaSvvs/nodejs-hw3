import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
    getAllNotes,
    getNoteById,
    createNote,
    updateNote,
    deleteNote,
} from '../controllers/notesController.js';
import {
    getAllNotesSchema,
    noteIdSchema, 
    createNoteSchema, 
    updateNoteSchema, 
} from '../validations/notesValidation.js'; 
import { authenticate } from '../middlewares/authenticate.js'; 

const router = Router();
router.use(authenticate); 
router.get(
    '/notes',
    celebrate(getAllNotesSchema), 
    getAllNotes,
);
router.post(
    '/notes',
    celebrate(createNoteSchema), 
    createNote,
);
router.get(
    '/notes/:noteId',
    celebrate(noteIdSchema), 
    getNoteById,
);
router.patch(
    '/notes/:noteId',
    celebrate(updateNoteSchema), 
    updateNote,
);
router.delete(
    '/notes/:noteId',
    celebrate(noteIdSchema), 
    deleteNote,
);
export default router;