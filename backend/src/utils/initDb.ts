import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const schemaPath = path.join(__dirname, '../../db_schema.sql');

const initDb = async () => {
    console.log(`Connecting to: ${process.env.DB_HOST} as ${process.env.DB_USER}`);
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || '127.0.0.1',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASS || '', // default xampp has no password
            multipleStatements: true
        });

        console.log('Connected to MySQL server');

        const schema = fs.readFileSync(schemaPath, 'utf8');

        await connection.query(schema);

        console.log('✅ Database and Initial Tables created successfully.');
        await connection.end();
        process.exit(0);
    } catch (error: any) {
        console.error('❌ Error initializing database:', error.message);
        if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('Make sure your DB_PASS in backend/.env is correct. XAMPP default is often empty string.');
        }
        process.exit(1);
    }
};

initDb();
