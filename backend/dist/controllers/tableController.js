"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTable = exports.updateTable = exports.addTable = exports.getTables = void 0;
const database_1 = __importDefault(require("../config/database"));
const getTables = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield database_1.default.query('SELECT * FROM restaurant_tables');
        res.json(rows);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching tables', error });
    }
});
exports.getTables = getTables;
const addTable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { table_number, capacity, type } = req.body;
    try {
        const [result] = yield database_1.default.query('INSERT INTO restaurant_tables (table_number, capacity, type, status) VALUES (?, ?, ?, ?)', [table_number, capacity, type || 'Regular', 'Available']);
        res.status(201).json({ message: 'Table added', id: result.insertId });
    }
    catch (error) {
        res.status(500).json({ message: 'Error adding table', error });
    }
});
exports.addTable = addTable;
const updateTable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status, capacity, type } = req.body; // Allow updating status or details
    // Build dynamic query or specific? simpler to just update what's passed
    // For simplicity, I'll update fields if they exist
    try {
        // This is a basic implementation. You might want to check if table exists first.
        yield database_1.default.query('UPDATE restaurant_tables SET status = COALESCE(?, status), capacity = COALESCE(?, capacity), type = COALESCE(?, type) WHERE id = ?', [status, capacity, type, id]);
        res.json({ message: 'Table updated' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating table', error });
    }
});
exports.updateTable = updateTable;
const deleteTable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield database_1.default.query('DELETE FROM restaurant_tables WHERE id = ?', [id]);
        res.json({ message: 'Table removed' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting table', error });
    }
});
exports.deleteTable = deleteTable;
