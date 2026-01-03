import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import logger from '../utils/logger';

interface ErrorResponse {
    success: boolean;
    message: string;
}

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    // Log error (without stack in console for cleaner logs)
    logger.error(err.message, {
        path: req.path,
        method: req.method,
        statusCode: err instanceof AppError ? err.statusCode : 500,
    });

    if (err instanceof AppError) {
        const response: ErrorResponse = {
            success: false,
            message: err.message,
        };
        res.status(err.statusCode).json(response);
        return;
    }

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        const response: ErrorResponse = {
            success: false,
            message: (err as any).message || 'Validation failed',
        };
        res.status(400).json(response);
        return;
    }

    // Handle MongoDB duplicate key errors
    if ((err as any).code === 11000) {
        const field = Object.keys((err as any).keyPattern || {})[0] || 'field';
        const response: ErrorResponse = {
            success: false,
            message: `${field} already exists`,
        };
        res.status(409).json(response);
        return;
    }

    // Handle MongoDB/Mongoose errors
    if (err.name === 'MongoError' || err.name === 'MongooseError') {
        const response: ErrorResponse = {
            success: false,
            message: 'Database operation failed',
        };
        res.status(500).json(response);
        return;
    }

    // Default error
    const response: ErrorResponse = {
        success: false,
        message: process.env.NODE_ENV === 'production'
            ? 'An unexpected error occurred'
            : err.message,
    };
    res.status(500).json(response);
};
