import { Router } from 'express';
import { getTables, addTable, updateTable, deleteTable } from '../controllers/tableController';
import { authenticate, authorize } from '../middlewares/authMiddleware';

const router = Router();

// Public or Customer: View tables? Maybe only authenticated? User says "Customer - View available tables".
router.get('/', authenticate, getTables);

// Manager only
router.post('/', authenticate, authorize(['Manager', 'Admin']), addTable);
router.put('/:id', authenticate, authorize(['Manager', 'Admin']), updateTable);
router.delete('/:id', authenticate, authorize(['Manager', 'Admin']), deleteTable);

export default router;
