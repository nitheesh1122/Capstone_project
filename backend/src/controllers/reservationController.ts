import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middlewares/authMiddleware';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const createReservation = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const { time, partySize } = req.body; // time is datetime string

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    try {
        // Find a table that fits the party size and is available
        // Simple logic: Check if table is available regarding status.
        // real world needs time slot checking.
        // Assuming 'Available' means it is free now and for the near future.
        // But 'reservation_time' implies a future booking.
        // If status is 'Available', we can book it.

        const [tables] = await pool.query<RowDataPacket[]>(
            'SELECT * FROM restaurant_tables WHERE capacity >= ? AND status = "Available" LIMIT 1',
            [partySize]
        );

        if (tables.length === 0) {
            return res.status(404).json({ message: 'No available tables for this party size' });
        }

        const tableId = tables[0].id;

        await pool.query(
            'UPDATE restaurant_tables SET status = "Reserved", reservation_time = ?, current_customer_id = ? WHERE id = ?',
            [time, userId, tableId]
        );

        res.json({ message: 'Reservation created', table: tables[0] });
    } catch (error) {
        res.status(500).json({ message: 'Error creating reservation', error });
    }
};

export const getUserReservations = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    try {
        const [rows] = await pool.query(
            'SELECT * FROM restaurant_tables WHERE current_customer_id = ? AND status = "Reserved"',
            [userId]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reservations', error });
    }
};

export const cancelReservation = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const { id } = req.params; // Table ID or Reservation ID? Table ID from the look of it.

    try {
        const [result] = await pool.query<ResultSetHeader>(
            'UPDATE restaurant_tables SET status = "Available", reservation_time = NULL, current_customer_id = NULL WHERE id = ? AND current_customer_id = ?',
            [id, userId] // Ensure user owns the reservation
        );

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: 'Reservation not found or not owned by you' });
        }

        res.json({ message: 'Reservation cancelled' });
    } catch (error) {
        res.status(500).json({ message: 'Error cancelling reservation', error });
    }
};
