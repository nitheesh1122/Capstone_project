import { Request, Response } from 'express';
import { readDb, writeDb } from '../utils/jsonDb';

export const createServiceRequest = async (req: Request, res: Response) => {
    try {
        const { tableId, requestType } = req.body;
        const db = await readDb();

        const newRequest = {
            id: Date.now(),
            tableId,
            requestType,
            status: 'Pending',
            createdAt: new Date().toISOString()
        };

        db.serviceRequests.push(newRequest);
        await writeDb(db);

        res.status(201).json({ message: 'Service request created', request: newRequest });
    } catch (error) {
        res.status(500).json({ message: 'Error creating request', error });
    }
};

export const getServiceRequests = async (req: Request, res: Response) => {
    try {
        const db = await readDb();
        const pendingRequests = db.serviceRequests.filter((r: any) => r.status === 'Pending');
        res.status(200).json(pendingRequests);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching requests', error });
    }
};

export const completeServiceRequest = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const db = await readDb();

        const reqIndex = db.serviceRequests.findIndex((r: any) => r.id == id);
        if (reqIndex === -1) {
            res.status(404).json({ message: 'Request not found' });
            return;
        }

        db.serviceRequests[reqIndex].status = 'Completed';
        await writeDb(db);

        res.status(200).json({ message: 'Request completed' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating request', error });
    }
};
