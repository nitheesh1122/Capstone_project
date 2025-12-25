import { Router } from 'express';
import { createReservation, getUserReservations, cancelReservation } from '../controllers/reservationController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authenticate, createReservation);
router.get('/', authenticate, getUserReservations);
router.delete('/:id', authenticate, cancelReservation);

export default router;
