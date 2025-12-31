import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middlewares/authMiddleware';
import { RowDataPacket } from 'mysql2';

export const joinQueue = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    try {
        // Check if already in queue
        const [userRows] = await pool.query<RowDataPacket[]>('SELECT queue_joined_at FROM users WHERE id = ?', [userId]);
        if (userRows.length > 0 && userRows[0].queue_joined_at) {
            return res.status(400).json({ message: 'Already in queue' });
        }

        await pool.query('UPDATE users SET queue_joined_at = NOW() WHERE id = ?', [userId]);
        res.json({ message: 'Joined queue successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error joining queue', error });
    }
};

export const getQueueStatus = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    try {
        const [queue] = await pool.query<RowDataPacket[]>(
            'SELECT id, name, queue_joined_at FROM users WHERE queue_joined_at IS NOT NULL ORDER BY queue_joined_at ASC'
        );

        const position = queue.findIndex((u: any) => u.id === userId) + 1;
        const myDetails = position > 0 ? queue[position - 1] : null;

        res.json({
            queueLength: queue.length,
            yourPosition: position > 0 ? position : null,
            estimatedWaitTime: position > 0 ? position * 15 : 0, // Mock estimate
            queue: queue // Optionally return full queue for managers?
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching queue status', error });
    }
};

export const leaveQueue = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    try {
        await pool.query('UPDATE users SET queue_joined_at = NULL WHERE id = ?', [userId]);
        res.json({ message: 'Left queue' });
    } catch (error) {
        res.status(500).json({ message: 'Error leaving queue', error });
    }
};
