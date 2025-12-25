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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var promise_1 = require("mysql2/promise");
var dotenv_1 = require("dotenv");
var fs_1 = require("fs");
var path_1 = require("path");
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
var schemaPath = path_1.default.join(__dirname, '../../db_schema.sql');
var initDb = function () { return __awaiter(void 0, void 0, void 0, function () {
    var connection, schema, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("Connecting to: ".concat(process.env.DB_HOST, " as ").concat(process.env.DB_USER));
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                return [4 /*yield*/, promise_1.default.createConnection({
                        host: process.env.DB_HOST || '127.0.0.1',
                        user: process.env.DB_USER || 'root',
                        password: process.env.DB_PASS || '', // default xampp has no password
                        multipleStatements: true
                    })];
            case 2:
                connection = _a.sent();
                console.log('Connected to MySQL server');
                schema = fs_1.default.readFileSync(schemaPath, 'utf8');
                return [4 /*yield*/, connection.query(schema)];
            case 3:
                _a.sent();
                console.log('✅ Database and Initial Tables created successfully.');
                return [4 /*yield*/, connection.end()];
            case 4:
                _a.sent();
                process.exit(0);
                return [3 /*break*/, 6];
            case 5:
                error_1 = _a.sent();
                console.error('❌ Error initializing database:', error_1.message);
                if (error_1.code === 'ER_ACCESS_DENIED_ERROR') {
                    console.error('Make sure your DB_PASS in backend/.env is correct. XAMPP default is often empty string.');
                }
                process.exit(1);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
initDb();
