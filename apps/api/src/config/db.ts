import mongoose from 'mongoose';
import { env } from './env';
import { logger } from './logger';

export async function connectDB(): Promise<void> {
  const maxRetries = 5;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      await mongoose.connect(env.MONGODB_URI);
      logger.info('✅ MongoDB connected successfully');
      return;
    } catch (error) {
      retries++;
      logger.error(`MongoDB connection attempt ${retries}/${maxRetries} failed`, { error });
      if (retries === maxRetries) {
        logger.warn('⚠️ MongoDB connection failed — running without database');
        return;
      }
      await new Promise((res) => setTimeout(res, 2000 * retries));
    }
  }
}
