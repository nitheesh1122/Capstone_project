import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(__dirname, '../../data/db.json');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Initial DB Structure
const initialDb = {
    users: [],
    tables: [],
    orders: [],
    serviceRequests: []
};

// Initialize DB if not exists
if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(initialDb, null, 2));
}

export const readDb = async () => {
    try {
        const data = fs.readFileSync(DB_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return initialDb;
    }
};

export const writeDb = async (data: any) => {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};
