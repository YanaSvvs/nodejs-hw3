import { Schema, model } from 'mongoose';

const TAG_ENUM = [
  'Work',
  'Personal',
  'Meeting',
  'Shopping',
  'Ideas',
  'Travel',
  'Finance',
  'Health',
  'Important',
  'Todo',
];
const noteSchema = new Schema(
  {
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
      enum: TAG_ENUM, 
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