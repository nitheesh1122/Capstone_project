import { Router } from 'express';
import { createTable, getTables, updateTable, deleteTable, updateTableStatus } from '../controllers/table.controller';
import { roleGuard } from '../middlewares/role.guard';

const router = Router();

// Manager only for table management
router.post('/', roleGuard(['MANAGER', 'ADMIN']), createTable);
router.get('/', roleGuard(['MANAGER', 'ADMIN']), getTables); // Prompt says "List all tables" under Table Management (Manager Only). But usually customers need to see tables? No, customers join queue.
router.put('/:id', roleGuard(['MANAGER', 'ADMIN']), updateTable);
router.delete('/:id', roleGuard(['MANAGER', 'ADMIN']), deleteTable);
router.put('/:id/status', roleGuard(['MANAGER', 'ADMIN']), updateTableStatus);

export default router;
