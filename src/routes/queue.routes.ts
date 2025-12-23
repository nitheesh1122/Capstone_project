import { Router } from 'express';
import { joinQueue, seatCustomer } from '../controllers/queue.controller';
import { roleGuard } from '../middlewares/role.guard';

const router = Router();

// Customer joins queue
router.post('/join', roleGuard(['CUSTOMER', 'MANAGER', 'ADMIN']), joinQueue);

// Manager seats customer
router.post('/seat', roleGuard(['MANAGER', 'ADMIN']), seatCustomer);

export default router;
