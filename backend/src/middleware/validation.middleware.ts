import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ValidationError } from '../utils/errors';

export const validate = (schema: ZodSchema) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                // Get the first error message
                const firstError = error.errors[0];
                const field = firstError.path.join('.');
                const message = firstError.message;

                // Extract field label if available (e.g., "body.password" -> "Password")
                const fieldLabel = field
                    .split('.')
                    .pop()
                    ?.replace(/([A-Z])/g, ' $1')
                    .replace(/^./, (str) => str.toUpperCase())
                    .trim() || field;

                // Use the error message as-is (it should have label from validator)
                next(new ValidationError(message));
            } else {
                next(error);
            }
        }
    };
};
