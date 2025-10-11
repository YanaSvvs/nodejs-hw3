import { Note } from '../models/note.js';
import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';

export const getAllNotes = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, tag, search } = req.query;
    const currentPage = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
    const itemsPerPage = parseInt(perPage, 10) > 0 ? parseInt(perPage, 10) : 10; 
    const skip = (currentPage - 1) * itemsPerPage;

    const filter = {};
    
    if (tag) {
      filter.tag = tag;
    }
    
    if (search) {
      filter.$text = { $search: search };
    }
    
    let baseQuery = Note.find(filter); 

    const countQuery = baseQuery.clone().countDocuments();
    const notesQuery = baseQuery.skip(skip).limit(itemsPerPage);
    
    const [totalNotes, notes] = await Promise.all([
      countQuery,
      notesQuery,
    ]);
    
    const totalPages = Math.ceil(totalNotes / itemsPerPage);
    
    res.status(200).json({
      page: currentPage,
      perPage: itemsPerPage,
      totalNotes: totalNotes,
      totalPages: totalPages,
      notes: notes,
    });
  } catch (error) {
    next(error);
  }
};

export const getNoteById = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    if (!isValidObjectId(noteId)) {
      return next(createHttpError(400, 'Invalid note ID format'));
    }
    const note = await Note.findById(noteId);
    if (!note) {
      return next(createHttpError(404, 'Note not found'));
    }
    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

export const createNote = async (req, res, next) => {
  try {
    const newNote = await Note.create(req.body); 
    res.status(201).json(newNote);
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const updateData = req.body;

    if (!isValidObjectId(noteId)) {
      return next(createHttpError(400, 'Invalid note ID format'));
    }
    
    const updatedNote = await Note.findByIdAndUpdate(noteId, updateData, {
      new: true, 
      runValidators: true, 
    });

    if (!updatedNote) {
      return next(createHttpError(404, 'Note not found'));
    }
    res.status(200).json(updatedNote);
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    if (!isValidObjectId(noteId)) {
      return next(createHttpError(400, 'Invalid note ID format'));
    }
    const deletedNote = await Note.findByIdAndDelete(noteId);
    if (!deletedNote) {
      return next(createHttpError(404, 'Note not found'));
    }
    res.status(200).json(deletedNote); 
  } catch (error) {
    next(error);
  }
};