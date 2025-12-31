import { Router } from 'express';
import { joinQueue, getQueueStatus, leaveQueue } from '../controllers/queueController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.post('/join', authenticate, joinQueue);
router.get('/status', authenticate, getQueueStatus);
router.post('/leave', authenticate, leaveQueue);

export default router;
