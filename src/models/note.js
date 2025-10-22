
import { Schema, model } from 'mongoose';
import { TAGS } from '../constants/tags.js';

const noteSchema = new Schema(
  {
   
    userId: {
      type: Schema.Types.ObjectId,
      required: true, 
      ref: 'User', 
    },
   
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: false,
      default: '',
      trim: true,
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

noteSchema.index({ title: 'text', content: 'text' });
export const Note = model('Note', noteSchema);
