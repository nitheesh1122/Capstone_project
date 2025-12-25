// MOCK DATABASE for Demo Purposes (No MySQL required)
const tables: any[] = [
    { id: 1, table_number: '1', capacity: 2, type: 'Regular', status: 'Available' },
    { id: 2, table_number: '2', capacity: 4, type: 'Regular', status: 'Occupied' },
    { id: 3, table_number: '3', capacity: 6, type: 'VIP', status: 'Reserved' },
];
// Minimal user/queue mock.
// In a real app, users would be in a DB. Here we just track queue state for "demo" users.
// Password for all is 'password'
const HASH = '$2a$10$zPzuDjyYHK2c97zPMvqaeeM5nl7emh2S5L5EwcCJHBfRLa009gTtG';
let users: any[] = [
    { id: 1, name: 'Alice', email: 'alice@test.com', password: HASH, role: 'User', queue_joined_at: null },
    { id: 2, name: 'Bob', email: 'bob@test.com', password: HASH, role: 'User', queue_joined_at: new Date(Date.now() - 1000000) }, // 15 mins ago
    { id: 3, name: 'Charlie', email: 'charlie@test.com', password: HASH, role: 'Manager', queue_joined_at: null }
];

// Helper to mimic MySQL response format: [rows, fields]
const pool = {
    getConnection: async () => ({
        release: () => { }
    }),
    // Generic signature to satisfy TS strict mode and controller usage like pool.query<RowDataPacket[]>
    query: async <T = any>(sql: string, params: any[] = []): Promise<[T, any]> => {
        console.log('MOCK SQL:', sql, params);

        // 1. GET TABLES
        if (sql.includes('SELECT * FROM restaurant_tables')) {
            return [tables as any, undefined];
        }

        // 2. INSERT TABLE
        if (sql.includes('INSERT INTO restaurant_tables')) {
            const newTable = {
                id: tables.length + 1,
                table_number: params[0],
                capacity: params[1],
                type: params[2],
                status: params[3]
            };
            tables.push(newTable);
            // Return shape { insertId: ... } cast as any to satisfy T
            return [{ insertId: newTable.id } as any, undefined];
        }

        // 3. UPDATE TABLE
        if (sql.includes('UPDATE restaurant_tables')) {
            const id = params[3]; // id is last
            const table = tables.find(t => t.id === Number(id));
            if (table) {
                // params: [status, capacity, type, id]
                // COALESCE logic mock: take param if not null/undefined
                if (params[0] !== undefined) table.status = params[0];
                if (params[1] !== undefined) table.capacity = params[1];
                if (params[2] !== undefined) table.type = params[2];
            }
            return [{ affectedRows: table ? 1 : 0 } as any, undefined];
        }

        // 4. DELETE TABLE
        if (sql.includes('DELETE FROM restaurant_tables')) {
            const id = params[0];
            const idx = tables.findIndex(t => t.id === Number(id));
            if (idx !== -1) tables.splice(idx, 1);
            return [{ affectedRows: idx !== -1 ? 1 : 0 } as any, undefined];
        }

        // 5. UPDATE USER / QUEUE (JOIN/LEAVE) based on SQL pattern
        if (sql.includes('UPDATE users SET queue_joined_at = NOW()')) {
            const id = params[0];
            const u = users.find(u => u.id === Number(id));
            if (u) u.queue_joined_at = new Date();
            return [{ affectedRows: u ? 1 : 0 } as any, undefined];
        }
        if (sql.includes('UPDATE users SET queue_joined_at = NULL')) {
            const id = params[0];
            const u = users.find(u => u.id === Number(id));
            if (u) u.queue_joined_at = null;
            return [{ affectedRows: u ? 1 : 0 } as any, undefined];
        }

        // 6. CHECK IF ALREADY IN QUEUE
        if (sql.includes('SELECT queue_joined_at FROM users WHERE id = ?')) {
            const id = params[0];
            const u = users.find(u => u.id === Number(id));
            // Return array of rows
            return [[u ? { queue_joined_at: u.queue_joined_at } : {}] as any, undefined];
        }

        // 7. GET QUEUE STATUS
        if (sql.includes('SELECT id, name, queue_joined_at FROM users WHERE queue_joined_at IS NOT NULL')) {
            const inQueue = users.filter(u => u.queue_joined_at !== null)
                .sort((a, b) => (a.queue_joined_at as Date).getTime() - (b.queue_joined_at as Date).getTime());
            return [inQueue as any, undefined];
        }

        // 8. FIND USER BY EMAIL (Login/Register)
        if (sql.includes('SELECT * FROM users WHERE email = ?')) {
            const email = params[0];
            const u = users.find(user => user.email === email);
            return [[u].filter(x => x) as any, undefined]; // return [rows]
        }

        // 9. INSERT USER (Register)
        if (sql.includes('INSERT INTO users')) {
            // INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)
            const newUser = {
                id: users.length + 1,
                name: params[0],
                email: params[1],
                password: params[2],
                role: params[3] || 'User',
                queue_joined_at: null
            };
            users.push(newUser);
            return [{ insertId: newUser.id } as any, undefined];
        }

        return [[] as any, undefined];
    }
};

export default pool;
