import mongoose from 'mongoose';
import config from './index';
import logger from '../utils/logger';

const connectDB = async (): Promise<void> => {
  try {
    const uri = config.env === 'test' ? config.mongodb.testUri : config.mongodb.uri;
    
    await mongoose.connect(uri);

    logger.info(`MongoDB Connected: ${mongoose.connection.host}`);

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed due to app termination');
      process.exit(0);
    });
  } catch (error) {
    logger.error('Error connecting to MongoDB (startup will continue without DB):', error);
    // Do not exit; allow app to run so other services (e.g., static routes, health) remain accessible.
  }
};

export default connectDB;
