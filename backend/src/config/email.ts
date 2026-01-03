import nodemailer from 'nodemailer';
import logger from '../utils/logger';

// Create transporter only if email is configured
let transporter: nodemailer.Transporter | null = null;

if (process.env.EMAIL_HOST) {
    transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
} else if (process.env.NODE_ENV === 'development') {
    logger.warn('EMAIL_HOST not configured. Email functionality will be disabled in development mode.');
}

export default transporter;
