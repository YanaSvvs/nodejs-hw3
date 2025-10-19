import { Router } from 'express';
import { celebrate, Segments } from 'celebrate';
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
    updateNoteBodySchema,
} from '../validations/notesValidation.js'; 

const router = Router();

router.get(
    '/notes',
    celebrate({ [Segments.QUERY]: getAllNotesSchema }), 
    getAllNotes,
);

router.post(
    '/notes',
    celebrate({ [Segments.BODY]: createNoteSchema }), 
    createNote,
);

router.get(
    '/notes/:noteId',
    celebrate(noteIdSchema), 
    getNoteById,
);

router.patch(
    '/notes/:noteId',
    celebrate({
        [Segments.PARAMS]: noteIdSchema.extract(Segments.PARAMS), 
        [Segments.BODY]: updateNoteBodySchema, 
    }),
    updateNote,
);

router.delete(
    '/notes/:noteId',
    celebrate(noteIdSchema), 
    deleteNote,
);

export default router;