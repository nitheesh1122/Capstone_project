import { Request, Response, NextFunction } from 'express';
import { TableModel } from '../models/table.model';
import { AppError } from '../middlewares/error.middleware';

export const createReservation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { tableId, reservationTime } = req.body;

        if (!tableId || !reservationTime) {
            return next(new AppError('Table ID and reservation time are required', 400));
        }

        const time = new Date(reservationTime);
        if (isNaN(time.getTime())) {
            return next(new AppError('Invalid date format', 400));
        }

        if (time <= new Date()) {
            return next(new AppError('Reservation time must be in the future', 400));
        }

        const table = await TableModel.findById(tableId);
        if (!table) {
            return next(new AppError('Table not found', 404));
        }

        // Conflict check
        // Since we only have one reservation slot per table (the table itself),
        // we check if it's already reserved or occupied.
        if (table.status !== 'AVAILABLE') {
            return next(new AppError('Table is not available for reservation', 409));
        }

        // Also check capacity? Prompt says "Table capacity matches".
        // But matches what? The request doesn't include party size.
        // I'll assume the user checks capacity before booking, or we require party size in body.
        // Let's add `partySize` to body to validate.
        const { partySize } = req.body;
        if (partySize && partySize > table.capacity) {
            return next(new AppError(`Table capacity (${table.capacity}) insufficient for party size (${partySize})`, 400));
        }

        await TableModel.reserve(tableId, time);

        res.status(201).json({
            success: true,
            message: 'Reservation created successfully'
        });
    } catch (error) {
        next(error);
    }
};

export const cancelReservation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id, 10); // Reservation ID? 
        // Wait, the prompt says `PUT /reservations/:id/cancel`.
        // But we don't have a reservations table. We only have `restaurant_tables`.
        // So `:id` must refer to the TABLE ID? Or is it a "reservation ID" concept?
        // Given "Maximum 2 database tables" and no reservation table, the "Reservation ID" is ambiguous.
        // It likely means the Table ID, or we treat the Table ID as the handle for the reservation.
        // OR, maybe `id` in the URL is the Table ID.
        // Let's assume `:id` is the Table ID, because that's the only ID we have associated with the reservation.

        if (isNaN(id)) {
            return next(new AppError('Invalid ID', 400));
        }

        const table = await TableModel.findById(id);
        if (!table) {
            return next(new AppError('Table not found', 404));
        }

        if (table.status !== 'RESERVED') {
            return next(new AppError('Table is not reserved', 400));
        }

        await TableModel.cancelReservation(id);

        res.status(200).json({
            success: true,
            message: 'Reservation cancelled successfully'
        });
    } catch (error) {
        next(error);
    }
};
