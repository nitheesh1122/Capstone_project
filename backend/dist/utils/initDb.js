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
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
const schemaPath = path_1.default.join(__dirname, '../../db_schema.sql');
const initDb = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Connecting to: ${process.env.DB_HOST} as ${process.env.DB_USER}`);
    try {
        const connection = yield promise_1.default.createConnection({
            host: process.env.DB_HOST || '127.0.0.1',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASS || '', // default xampp has no password
            multipleStatements: true
        });
        console.log('Connected to MySQL server');
        const schema = fs_1.default.readFileSync(schemaPath, 'utf8');
        yield connection.query(schema);
        console.log('✅ Database and Initial Tables created successfully.');
        yield connection.end();
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error initializing database:', error.message);
        if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('Make sure your DB_PASS in backend/.env is correct. XAMPP default is often empty string.');
        }
        process.exit(1);
    }
});
initDb();
