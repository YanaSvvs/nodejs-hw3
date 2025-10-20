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
    noteIdParamsSchema, 
    createNoteSchema,
    updateNoteBodySchema,
} from '../validations/notesValidation.js'; 

const router = Router();

router.get(
    '/notes',
    celebrate(getAllNotesSchema), 
    getAllNotes,
);

router.post(
    '/notes',
    celebrate({ [Segments.BODY]: createNoteSchema }), 
    createNote,
);

router.get(
    '/notes/:noteId',
    celebrate({ [Segments.PARAMS]: noteIdParamsSchema }), 
    getNoteById,
);

router.patch(
    '/notes/:noteId',
    celebrate({
        [Segments.PARAMS]: noteIdParamsSchema, 
        [Segments.BODY]: updateNoteBodySchema, 
    }),
    updateNote,
);

router.delete(
    '/notes/:noteId',
    celebrate({ [Segments.PARAMS]: noteIdParamsSchema }), 
    deleteNote,
);

export default router;
