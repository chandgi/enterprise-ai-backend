import { app, eventEmitter, connectDB, redisClient } from './app.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3005;

process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...');
    try {
        await redisClient.quit();
        console.log('Redis connection closed.');
        process.exit(0);
    } catch (err) {
        console.error('Error during shutdown:', err);
        process.exit(1);
    }
});

const server = app.listen(PORT, async () => {
    try {
        await connectDB();
        console.log(`Server is running on port ${PORT}`);
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
});

export { server, eventEmitter };