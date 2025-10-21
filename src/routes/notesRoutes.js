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
    createNoteFullSchema, 
    updateNoteSchema, 
} from '../validations/notesValidation.js'; 

const router = Router();

router.get(
    '/notes',
    celebrate(getAllNotesSchema), 
    getAllNotes,
);

router.post(
    '/notes',
    celebrate(createNoteFullSchema), 
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
