
import { Router } from 'express';
import { celebrate } from 'celebrate'; 
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
    celebrate({ query: getAllNotesQuerySchema }), 
    getAllNotes,
);

router.post(
    '/notes',
    celebrate({ body: createNoteSchema }),
    createNote,
);

router.get(
    '/notes/:noteId',
    celebrate({ params: noteIdParamsSchema }), 
    getNoteById,
);

router.patch(
    '/notes/:noteId',
    celebrate({ params: noteIdParamsSchema, body: updateNoteBodySchema }), 
    updateNote,
);

router.delete(
    '/notes/:noteId',
    celebrate({ params: noteIdParamsSchema }),
    deleteNote,
);

export default router;