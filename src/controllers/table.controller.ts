import { Request, Response, NextFunction } from 'express';
import { TableModel } from '../models/table.model';
import { AppError } from '../middlewares/error.middleware';

export const createTable = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { table_number, capacity, type } = req.body;

        if (!table_number || !capacity || !type) {
            return next(new AppError('Table number, capacity, and type are required', 400));
        }

        if (capacity <= 0) {
            return next(new AppError('Capacity must be greater than 0', 400));
        }

        if (!['REGULAR', 'VIP'].includes(type)) {
            return next(new AppError('Invalid table type', 400));
        }

        // Check if table number already exists? (Not strictly required by prompt but good practice, skipping for simplicity unless needed)

        const newTable = await TableModel.create({
            table_number,
            capacity,
            type,
            status: 'AVAILABLE'
        });

        res.status(201).json({
            success: true,
            data: newTable,
            message: 'Table created successfully'
        });
    } catch (error) {
        next(error);
    }
};

export const getTables = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tables = await TableModel.findAll();
        res.status(200).json({
            success: true,
            data: tables,
            message: 'Tables retrieved successfully'
        });
    } catch (error) {
        next(error);
    }
};

export const updateTable = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id, 10);
        const updates = req.body;

        if (isNaN(id)) {
            return next(new AppError('Invalid table ID', 400));
        }

        const success = await TableModel.update(id, updates);

        if (!success) {
            return next(new AppError('Table not found or no changes made', 404));
        }

        const updatedTable = await TableModel.findById(id);

        res.status(200).json({
            success: true,
            data: updatedTable,
            message: 'Table updated successfully'
        });
    } catch (error) {
        next(error);
    }
};

export const deleteTable = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return next(new AppError('Invalid table ID', 400));
        }

        const success = await TableModel.delete(id);

        if (!success) {
            return next(new AppError('Table not found', 404));
        }

        res.status(200).json({
            success: true,
            data: null,
            message: 'Table deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

export const updateTableStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { status } = req.body;

        if (isNaN(id)) {
            return next(new AppError('Invalid table ID', 400));
        }

        if (!['AVAILABLE', 'OCCUPIED', 'RESERVED'].includes(status)) {
            return next(new AppError('Invalid status', 400));
        }

        const table = await TableModel.findById(id);
        if (!table) {
            return next(new AppError('Table not found', 404));
        }

        // Allowed transitions
        // AVAILABLE -> RESERVED
        // RESERVED -> OCCUPIED
        // OCCUPIED -> AVAILABLE

        const currentStatus = table.status;
        let isValidTransition = false;

        if (currentStatus === 'AVAILABLE' && status === 'RESERVED') isValidTransition = true;
        if (currentStatus === 'RESERVED' && status === 'OCCUPIED') isValidTransition = true;
        if (currentStatus === 'OCCUPIED' && status === 'AVAILABLE') isValidTransition = true;

        // Also allow direct seating? "Manager seats next customer... Updates table status to OCCUPIED"
        // If a table is AVAILABLE, can it go to OCCUPIED directly? 
        // The prompt says: "Allowed transitions only: AVAILABLE -> RESERVED, RESERVED -> OCCUPIED, OCCUPIED -> AVAILABLE"
        // BUT in Queue Management: "Assigns customer to an AVAILABLE table -> Updates table status to OCCUPIED"
        // This contradicts the "Allowed transitions only" list if strictly interpreted.
        // However, usually "Seat" implies AVAILABLE -> OCCUPIED.
        // I will allow AVAILABLE -> OCCUPIED as well, or else the Queue logic is impossible.
        // Wait, maybe the flow is AVAILABLE -> RESERVED (instantly) -> OCCUPIED? No, that's silly.
        // I'll assume the "Allowed transitions" list was for the `PUT /tables/:id/status` endpoint specifically, 
        // but the system logic might allow other transitions.
        // OR, I should strictly follow the list for the manual endpoint.
        // I will strictly follow the list for THIS endpoint. The Queue controller can do what it needs via the Model.

        if (!isValidTransition) {
            return next(new AppError(`Invalid status transition from ${currentStatus} to ${status}`, 400));
        }

        await TableModel.updateStatus(id, status);

        // If becoming AVAILABLE, clear customer and reservation?
        if (status === 'AVAILABLE') {
            // We need to clear current_customer_id and reservation_time
            // The Model.updateStatus only updates status.
            // I should probably update the model to handle this or do it here.
            // Let's do it here by calling update.
            await TableModel.update(id, { current_customer_id: null, reservation_time: null });
        }

        res.status(200).json({
            success: true,
            message: 'Table status updated successfully'
        });
    } catch (error) {
        next(error);
    }
};
