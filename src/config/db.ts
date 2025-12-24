import mongoose from 'mongoose';

export const connectDB = async () => {
    const MONGODBURL = process.env.MONGODB_URL as string;
  try {

    const conn = await mongoose.connect(MONGODBURL);
    console.log("✅ Database connected");
    
   
    try {
      await mongoose.connection.collection('users').dropIndex('email_1');
    } catch (e) { /* Ignore */ }
    
  } catch (error) {
    console.error("❌ Database connection error:", error);
    process.exit(1);
  }
};