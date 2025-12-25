import { Request, Response } from 'express';
import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const getTables = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.query('SELECT * FROM restaurant_tables');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tables', error });
    }
};

export const addTable = async (req: Request, res: Response) => {
    const { table_number, capacity, type } = req.body;
    try {
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO restaurant_tables (table_number, capacity, type, status) VALUES (?, ?, ?, ?)',
            [table_number, capacity, type || 'Regular', 'Available']
        );
        res.status(201).json({ message: 'Table added', id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Error adding table', error });
    }
};

export const updateTable = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, capacity, type } = req.body; // Allow updating status or details

    // Build dynamic query or specific? simpler to just update what's passed
    // For simplicity, I'll update fields if they exist
    try {
        // This is a basic implementation. You might want to check if table exists first.
        await pool.query(
            'UPDATE restaurant_tables SET status = COALESCE(?, status), capacity = COALESCE(?, capacity), type = COALESCE(?, type) WHERE id = ?',
            [status, capacity, type, id]
        );
        res.json({ message: 'Table updated' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating table', error });
    }
};

export const deleteTable = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM restaurant_tables WHERE id = ?', [id]);
        res.json({ message: 'Table removed' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting table', error });
    }
};
