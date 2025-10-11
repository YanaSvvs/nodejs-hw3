import { Schema, model } from 'mongoose';
import { TAGS } from '../constants/tags.js'; 

const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true, 
      index: 'text', 
    },
    content: {
      type: String,
      required: false,
      default: '', 
      trim: true,
      index: 'text', 
    },
    tag: {
      type: String,
      enum: TAGS, 
      required: false,
      default: 'Todo', 
    },
  },
  {
    timestamps: true, 
    collection: 'notes', 
  },
);

export const Note = model('Note', noteSchema);