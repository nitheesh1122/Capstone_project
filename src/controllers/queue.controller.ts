import { Request, Response, NextFunction } from 'express';
import { TableModel } from '../models/table.model';
import { UserModel } from '../models/user.model';
import { AppError } from '../middlewares/error.middleware';

// In-memory queue storing user IDs
const queue: number[] = [];

export const joinQueue = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id; // From roleGuard
        if (!userId) {
            return next(new AppError('User ID required', 400));
        }

        // Check if user is already in queue
        if (queue.includes(userId)) {
            return next(new AppError('User already in queue', 400));
        }

        // Check if user is already seated? (Optional, but good)
        // We'd need to query tables to see if current_customer_id matches.
        // Skipping for simplicity/performance unless required.

        queue.push(userId);
        const position = queue.length;

        // Simple wait time heuristic: 15 mins per person in front
        // A better one: (position / total_tables) * avg_time
        // Let's just say 10 mins * position
        const estimatedWaitTime = position * 10;

        res.status(200).json({
            success: true,
            data: {
                position,
                estimatedWaitTime: `${estimatedWaitTime} minutes`
            },
            message: 'Joined queue successfully'
        });
    } catch (error) {
        next(error);
    }
};

export const seatCustomer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (queue.length === 0) {
            return next(new AppError('Queue is empty', 400));
        }

        // Find an available table
        // Logic: Just find ANY available table? Or match capacity?
        // Prompt says: "Assigns customer to an AVAILABLE table"
        // Ideally we should match capacity.
        // But we don't know the party size of the user in the queue (schema doesn't store party size for user).
        // So we assume party size 1 or we just assign the first available table.
        // Let's find the first AVAILABLE table.

        const tables = await TableModel.findAll();
        const availableTable = tables.find(t => t.status === 'AVAILABLE');

        if (!availableTable) {
            return next(new AppError('No tables available', 400));
        }

        const nextUserId = queue.shift(); // FIFO

        if (!nextUserId) {
            return next(new AppError('Queue processing error', 500));
        }

        // Assign user to table
        await TableModel.assignCustomer(availableTable.id!, nextUserId);

        res.status(200).json({
            success: true,
            data: {
                tableId: availableTable.id,
                userId: nextUserId,
                tableNumber: availableTable.table_number
            },
            message: 'Customer seated successfully'
        });
    } catch (error) {
        next(error);
    }
};
