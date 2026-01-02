import express from 'express';
import dotenv from 'dotenv';
import timetableRoutes from './routes/timetable.route.js';
import moduleRoutes from './routes/module.route.js';
import roomRoutes from './routes/room.route.js';
import userRoutes from './routes/user.route.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';
import { logger } from './middleware/logger.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/timetable', timetableRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/users', userRoutes);

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

export default app;
