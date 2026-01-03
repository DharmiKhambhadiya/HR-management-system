import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/error.middleware';
import logger from './utils/logger';
import connectDB from './config/database';

// Import routes
import authRoutes from './routes/auth.routes';
import profileRoutes from './routes/profile.routes';
import dashboardRoutes from './routes/dashboard.routes';
import attendanceRoutes from './routes/attendance.routes';
import leaveRoutes from './routes/leave.routes';
import payrollRoutes from './routes/payroll.routes';
import adminRoutes from './routes/admin.routes';
import notificationRoutes from './routes/notification.routes';
import holidayRoutes from './routes/holiday.routes';
import leaveTypeRoutes from './routes/leavetype.routes';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;
const API_VERSION = process.env.API_VERSION || 'v1';

// Security middleware
app.use(helmet());

// CORS configuration (supports comma-separated origins)
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:3000')
    .split(',')
    .map((origin) => origin.replace(/\/$/, ''));

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// Rate limiting - General API limiter
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'), // 1 minute
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // 100 requests per minute
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
        res.status(429).json({
            success: false,
            message: 'Too many requests from this IP, please try again later.',
        });
    },
});

// Rate limiting - Authentication endpoints (stricter)
const authLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'), // 1 minute
    max: parseInt(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS || '5'), // 5 requests per minute
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
        res.status(429).json({
            success: false,
            message: 'Too many authentication attempts, please try again later.',
        });
    },
});

// Apply rate limiting to all API routes
app.use('/api', limiter);

// Health check endpoint (no rate limiting)
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});

// API routes
const apiRouter = express.Router();

// Apply auth limiter to authentication routes
apiRouter.use('/auth', authLimiter, authRoutes);

// Other routes use the general limiter (already applied at /api level)
apiRouter.use('/profile', profileRoutes);
apiRouter.use('/dashboard', dashboardRoutes);
apiRouter.use('/attendance', attendanceRoutes);
apiRouter.use('/leave', leaveRoutes);
apiRouter.use('/payroll', payrollRoutes);
apiRouter.use('/admin', adminRoutes);
apiRouter.use('/notifications', notificationRoutes);
apiRouter.use('/holiday', holidayRoutes);
apiRouter.use('/leave-type', leaveTypeRoutes);

app.use(`/api/${API_VERSION}`, apiRouter);

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});

// Global error handler
app.use(errorHandler);

// Connect to MongoDB and start server
connectDB().then(() => {
    app.listen(PORT, () => {
        logger.info(`🚀 Server is running on port ${PORT}`);
        logger.info(`📡 API version: ${API_VERSION}`);
        logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
        logger.info(`🔗 Health check: http://localhost:${PORT}/health`);
        logger.info(`🔗 API base URL: http://localhost:${PORT}/api/${API_VERSION}`);
    });
}).catch((error) => {
    logger.error('Failed to start server:', error);
    process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    process.exit(0);
});

process.on('SIGINT', () => {
    logger.info('SIGINT signal received: closing HTTP server');
    process.exit(0);
});

export default app;
