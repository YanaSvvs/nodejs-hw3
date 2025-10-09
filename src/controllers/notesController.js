
import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

export const getAllNotes = async (req, res, next) => {
  try {
   
    const { page, perPage, tag, search } = req.query;
    const filter = {};
    if (tag) {
      filter.tag = tag; 
    }
    if (search) {
      
      filter.$or = [
        { title: { $regex: search, $options: 'i' } }, 
        { content: { $regex: search, $options: 'i' } },
      ];
    }
    
    const totalNotes = await Note.countDocuments(filter); 
    const totalPages = Math.ceil(totalNotes / perPage);
    const skip = (page - 1) * perPage; 
    const notes = await Note.find(filter)
      .skip(skip)
      .limit(perPage);
    
    res.status(200).json({
      page: Number(page),
      perPage: Number(perPage),
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
    const deletedNote = await Note.findByIdAndDelete(noteId);
    if (!deletedNote) {
      return next(createHttpError(404, 'Note not found'));
    }
    res.status(200).json(deletedNote); 
  } catch (error) {
    next(error);
  }
};

