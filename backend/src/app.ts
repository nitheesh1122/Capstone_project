import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import tableRoutes from './routes/tableRoutes';
import queueRoutes from './routes/queueRoutes';
import reservationRoutes from './routes/reservationRoutes';
import orderRoutes from './routes/orderRoutes';
import serviceRoutes from './routes/serviceRoutes';

dotenv.config();

const app: Application = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/queue', queueRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/service', serviceRoutes);

// Health Check
app.get('/', (req: Request, res: Response) => {
    res.send('Restaurant Management System API is running');
});

// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

export default app;
