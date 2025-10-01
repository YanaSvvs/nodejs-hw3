import mongoose from 'mongoose';
import 'dotenv/config'; 

export const connectMongoDB = async () => {
  const url = process.env.MONGO_URL;

  if (!url) {
    console.error('❌ MONGO_URL not found in environment variables.');
    return; 
  }

  try {
    await mongoose.connect(url);
    console.log('✅ MongoDB connection established successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1); 
  }
};