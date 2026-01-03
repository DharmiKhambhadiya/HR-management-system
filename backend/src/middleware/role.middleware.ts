import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../utils/errors';
import { Role } from '../types';

export const requireRole = (...allowedRoles: Role[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            if (!req.user) {
                throw new ForbiddenError('User not authenticated');
            }

            if (!allowedRoles.includes(req.user.role)) {
                throw new ForbiddenError('Insufficient permissions');
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

export const requireHR = requireRole(Role.HR);
export const requireEmployee = requireRole(Role.EMPLOYEE);
export const requireAny = requireRole(Role.HR, Role.EMPLOYEE);

// Backward compatibility
export const requireAdmin = requireHR;
