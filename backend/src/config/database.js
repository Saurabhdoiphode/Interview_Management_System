const mongoose = require('mongoose');
const config = require('./index');
const logger = require('../utils/logger');

const connectDB = async () => {
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
  }
};

module.exports = connectDB;
