import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes';
import tableRoutes from './routes/table.routes';
import queueRoutes from './routes/queue.routes';
import reservationRoutes from './routes/reservation.routes';
import { errorHandler } from './middlewares/error.middleware';
import { createUserTable } from './models/user.model';
import { createRestaurantTableTable } from './models/table.model';

dotenv.config();

const app = express();

app.use(express.json());

// Routes
app.use('/users', userRoutes);
app.use('/tables', tableRoutes);
app.use('/queue', queueRoutes);
app.use('/reservations', reservationRoutes);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ success: true, message: 'Server is healthy' });
});

// Initialize DB Tables
const initDB = async () => {
    try {
        await createUserTable();
        await createRestaurantTableTable();
        console.log('Database tables initialized');
    } catch (error) {
        console.error('Failed to initialize database tables:', error);
    }
};

initDB();

// Error Handler
app.use(errorHandler);

export default app;
