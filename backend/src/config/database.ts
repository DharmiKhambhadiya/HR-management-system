import mongoose from 'mongoose';
import logger from '../utils/logger';

const connectDB = async (): Promise<void> => {
    try {
        const mongoURI = process.env.DATABASE_URL || process.env.MONGODB_URI;
        
        if (!mongoURI) {
            throw new Error('MongoDB connection string not found in environment variables');
        }

        await mongoose.connect(mongoURI);

        logger.info('MongoDB connected successfully');

        mongoose.connection.on('error', (err) => {
            logger.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            logger.info('MongoDB disconnected');
        });

        // Graceful shutdown
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            logger.info('MongoDB connection closed through app termination');
            process.exit(0);
        });
    } catch (error) {
        logger.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

export default connectDB;
