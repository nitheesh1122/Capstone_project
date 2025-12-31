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
exports.cancelReservation = exports.getUserReservations = exports.createReservation = void 0;
const database_1 = __importDefault(require("../config/database"));
const createReservation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { time, partySize } = req.body; // time is datetime string
    if (!userId)
        return res.status(401).json({ message: 'Unauthorized' });
    try {
        // Find a table that fits the party size and is available
        // Simple logic: Check if table is available regarding status.
        // real world needs time slot checking.
        // Assuming 'Available' means it is free now and for the near future.
        // But 'reservation_time' implies a future booking.
        // If status is 'Available', we can book it.
        const [tables] = yield database_1.default.query('SELECT * FROM restaurant_tables WHERE capacity >= ? AND status = "Available" LIMIT 1', [partySize]);
        if (tables.length === 0) {
            return res.status(404).json({ message: 'No available tables for this party size' });
        }
        const tableId = tables[0].id;
        yield database_1.default.query('UPDATE restaurant_tables SET status = "Reserved", reservation_time = ?, current_customer_id = ? WHERE id = ?', [time, userId, tableId]);
        res.json({ message: 'Reservation created', table: tables[0] });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating reservation', error });
    }
});
exports.createReservation = createReservation;
const getUserReservations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const [rows] = yield database_1.default.query('SELECT * FROM restaurant_tables WHERE current_customer_id = ? AND status = "Reserved"', [userId]);
        res.json(rows);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching reservations', error });
    }
});
exports.getUserReservations = getUserReservations;
const cancelReservation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { id } = req.params; // Table ID or Reservation ID? Table ID from the look of it.
    try {
        const [result] = yield database_1.default.query('UPDATE restaurant_tables SET status = "Available", reservation_time = NULL, current_customer_id = NULL WHERE id = ? AND current_customer_id = ?', [id, userId] // Ensure user owns the reservation
        );
        if (result.affectedRows === 0) {
            return res.status(400).json({ message: 'Reservation not found or not owned by you' });
        }
        res.json({ message: 'Reservation cancelled' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error cancelling reservation', error });
    }
});
exports.cancelReservation = cancelReservation;
