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
exports.leaveQueue = exports.getQueueStatus = exports.joinQueue = void 0;
const database_1 = __importDefault(require("../config/database"));
const joinQueue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId)
        return res.status(401).json({ message: 'Unauthorized' });
    try {
        // Check if already in queue
        const [userRows] = yield database_1.default.query('SELECT queue_joined_at FROM users WHERE id = ?', [userId]);
        if (userRows.length > 0 && userRows[0].queue_joined_at) {
            return res.status(400).json({ message: 'Already in queue' });
        }
        yield database_1.default.query('UPDATE users SET queue_joined_at = NOW() WHERE id = ?', [userId]);
        res.json({ message: 'Joined queue successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error joining queue', error });
    }
});
exports.joinQueue = joinQueue;
const getQueueStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const [queue] = yield database_1.default.query('SELECT id, name, queue_joined_at FROM users WHERE queue_joined_at IS NOT NULL ORDER BY queue_joined_at ASC');
        const position = queue.findIndex((u) => u.id === userId) + 1;
        const myDetails = position > 0 ? queue[position - 1] : null;
        res.json({
            queueLength: queue.length,
            yourPosition: position > 0 ? position : null,
            estimatedWaitTime: position > 0 ? position * 15 : 0, // Mock estimate
            queue: queue // Optionally return full queue for managers?
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching queue status', error });
    }
});
exports.getQueueStatus = getQueueStatus;
const leaveQueue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId)
        return res.status(401).json({ message: 'Unauthorized' });
    try {
        yield database_1.default.query('UPDATE users SET queue_joined_at = NULL WHERE id = ?', [userId]);
        res.json({ message: 'Left queue' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error leaving queue', error });
    }
});
exports.leaveQueue = leaveQueue;
