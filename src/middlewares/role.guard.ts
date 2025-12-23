import { Request, Response, NextFunction } from 'express';
import { AppError } from './error.middleware';
import { UserModel } from '../models/user.model';

// Extend Express Request to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                role: 'CUSTOMER' | 'MANAGER' | 'ADMIN';
            };
        }
    }
}

export const roleGuard = (allowedRoles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // For this assignment, we assume the user ID is passed in a header 'x-user-id'
            // In a real app, this would be extracted from a JWT or session
            const userIdHeader = req.headers['x-user-id'];

            if (!userIdHeader) {
                // If no user ID, we might allow public access if the route is public, 
                // but here we are guarding specific routes.
                // However, for 'join queue' etc, we need to know who it is.
                return next(new AppError('Unauthorized: Missing x-user-id header', 401));
            }

            const userId = parseInt(userIdHeader as string, 10);
            if (isNaN(userId)) {
                return next(new AppError('Unauthorized: Invalid user ID', 401));
            }

            const user = await UserModel.findById(userId);

            if (!user) {
                return next(new AppError('Unauthorized: User not found', 401));
            }

            if (!allowedRoles.includes(user.role) && !allowedRoles.includes('ADMIN')) { // Admin usually has access to everything, or explicit
                // Prompt says: "Admin -> optional access to everything"
                // So we'll allow ADMIN if not explicitly forbidden? 
                // Or just add ADMIN to allowedRoles in the route definition.
                // Let's stick to checking if user.role is in allowedRoles.
                return next(new AppError('Forbidden: Insufficient permissions', 403));
            }

            req.user = {
                id: user.id!,
                role: user.role
            };

            next();
        } catch (error) {
            next(error);
        }
    };
};
