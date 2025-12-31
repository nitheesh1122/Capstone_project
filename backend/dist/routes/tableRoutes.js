"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tableController_1 = require("../controllers/tableController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Public or Customer: View tables? Maybe only authenticated? User says "Customer - View available tables".
router.get('/', authMiddleware_1.authenticate, tableController_1.getTables);
// Manager only
router.post('/', authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)(['Manager', 'Admin']), tableController_1.addTable);
router.put('/:id', authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)(['Manager', 'Admin']), tableController_1.updateTable);
router.delete('/:id', authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)(['Manager', 'Admin']), tableController_1.deleteTable);
exports.default = router;
