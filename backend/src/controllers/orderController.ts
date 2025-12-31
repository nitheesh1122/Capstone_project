import { Request, Response } from 'express';
import { readDb, writeDb } from '../utils/jsonDb';

export const createOrder = async (req: Request, res: Response) => {
    try {
        const { tableId, items, totalPrice, customerId } = req.body;
        const db = await readDb();

        const newOrder = {
            id: Date.now(),
            tableId,
            customerId, // Optional
            items,
            totalPrice,
            status: 'Received',
            createdAt: new Date().toISOString()
        };

        db.orders.push(newOrder);
        await writeDb(db);

        res.status(201).json({ message: 'Order created successfully', order: newOrder });
    } catch (error) {
        res.status(500).json({ message: 'Error creating order', error });
    }
};

export const getOrders = async (req: Request, res: Response) => {
    try {
        const db = await readDb();
        // Sort by newest first
        const sortedOrders = db.orders.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        res.status(200).json(sortedOrders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error });
    }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const db = await readDb();

        const orderIndex = db.orders.findIndex((o: any) => o.id == id);
        if (orderIndex === -1) {
            res.status(404).json({ message: 'Order not found' });
            return; // Ensure we return to stop execution
        }

        db.orders[orderIndex].status = status;
        await writeDb(db);

        res.status(200).json({ message: 'Order status updated', order: db.orders[orderIndex] });
    } catch (error) {
        res.status(500).json({ message: 'Error updating order', error });
    }
};
