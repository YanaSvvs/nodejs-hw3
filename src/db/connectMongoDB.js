import mongoose from 'mongoose';
import { Note } from '../models/note.js'; 
import { User } from '../models/user.js'; 
import { Session } from '../models/session.js'; 

export const connectMongoDB = async () => {
  if (!process.env.MONGO_URL) {
    console.error('❌ MONGO_URL is not defined in the environment variables!');
    process.exit(1);
  }
  
  try {
   
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ MongoDB connection established successfully');
    await Note.syncIndexes();
    await User.syncIndexes(); 
    await Session.syncIndexes(); 
    
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
};
