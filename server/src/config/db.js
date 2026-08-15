import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nexus-ai', {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`[MongoDB Warning] Could not connect to MongoDB at ${process.env.MONGODB_URI}: ${error.message}`);
    console.warn('[MongoDB Warning] Operating in fallback memory mode for un-persisted demo endpoints if DB is unavailable.');
    return null;
  }
};
