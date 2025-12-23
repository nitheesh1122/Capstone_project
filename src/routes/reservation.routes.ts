import { Router } from 'express';
import { createReservation, cancelReservation } from '../controllers/reservation.controller';
import { roleGuard } from '../middlewares/role.guard';

const router = Router();

// Create reservation (Customer/Manager)
router.post('/', roleGuard(['CUSTOMER', 'MANAGER', 'ADMIN']), createReservation);

// Cancel reservation (Customer/Manager)
// Note: In a real app, we'd check if the user owns the reservation. 
// Here we just allow it if they have the role.
router.put('/:id/cancel', roleGuard(['CUSTOMER', 'MANAGER', 'ADMIN']), cancelReservation);

export default router;
