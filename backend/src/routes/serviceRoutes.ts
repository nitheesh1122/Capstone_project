import express from 'express';
import { createServiceRequest, getServiceRequests, completeServiceRequest } from '../controllers/serviceController';

const router = express.Router();

router.post('/', createServiceRequest);
router.get('/', getServiceRequests);
router.patch('/:id/complete', completeServiceRequest);

export default router;
