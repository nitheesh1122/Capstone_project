import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../models/user.model';
import { AppError } from '../middlewares/error.middleware';

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, role, contact_info } = req.body;

        if (!name || !role) {
            return next(new AppError('Name and role are required', 400));
        }

        if (!['CUSTOMER', 'MANAGER', 'ADMIN'].includes(role)) {
            return next(new AppError('Invalid role', 400));
        }

        const newUser = await UserModel.create({ name, role, contact_info });

        res.status(201).json({
            success: true,
            data: newUser,
            message: 'User created successfully'
        });
    } catch (error) {
        next(error);
    }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return next(new AppError('Invalid user ID', 400));
        }

        const user = await UserModel.findById(id);

        if (!user) {
            return next(new AppError('User not found', 404));
        }

        res.status(200).json({
            success: true,
            data: user,
            message: 'User retrieved successfully'
        });
    } catch (error) {
        next(error);
    }
};
