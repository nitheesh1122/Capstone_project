import request from 'supertest';
import app from '../app';
import { pool } from '../config/db';

// Mock mysql2
jest.mock('../config/db', () => ({
    pool: {
        query: jest.fn(),
        getConnection: jest.fn().mockResolvedValue({
            release: jest.fn()
        })
    },
    checkConnection: jest.fn()
}));

describe('API Integration Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('User Routes', () => {
        it('should create a new user', async () => {
            (pool.query as jest.Mock).mockResolvedValueOnce([{ insertId: 1 }]); // Insert result

            const res = await request(app)
                .post('/users')
                .send({
                    name: 'John Doe',
                    role: 'CUSTOMER',
                    contact_info: 'john@example.com'
                });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.id).toBe(1);
        });

        it('should get a user by id', async () => {
            const mockUser = { id: 1, name: 'John Doe', role: 'CUSTOMER' };
            (pool.query as jest.Mock).mockResolvedValueOnce([[mockUser]]); // Select result

            const res = await request(app).get('/users/1');

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(mockUser);
        });
    });

    describe('Table Routes', () => {
        it('should create a table (Manager)', async () => {
            // Mock User Middleware lookup
            (pool.query as jest.Mock)
                .mockResolvedValueOnce([[{ id: 1, role: 'MANAGER' }]]) // Role guard user lookup
                .mockResolvedValueOnce([{ insertId: 1 }]); // Insert table

            const res = await request(app)
                .post('/tables')
                .set('x-user-id', '1')
                .send({
                    table_number: 1,
                    capacity: 4,
                    type: 'REGULAR'
                });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
        });

        it('should list tables', async () => {
            // Mock User Middleware lookup
            (pool.query as jest.Mock)
                .mockResolvedValueOnce([[{ id: 1, role: 'MANAGER' }]]) // Role guard user lookup
                .mockResolvedValueOnce([[{ id: 1, table_number: 1, status: 'AVAILABLE' }]]); // Select tables

            const res = await request(app)
                .get('/tables')
                .set('x-user-id', '1');

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveLength(1);
        });
    });

    describe('Queue Routes', () => {
        it('should allow customer to join queue', async () => {
            // Mock User Middleware lookup
            (pool.query as jest.Mock)
                .mockResolvedValueOnce([[{ id: 2, role: 'CUSTOMER' }]]); // Role guard user lookup

            const res = await request(app)
                .post('/queue/join')
                .set('x-user-id', '2');

            expect(res.status).toBe(200);
            expect(res.body.data.position).toBe(1);
        });

        it('should seat customer (Manager)', async () => {
            // 1. Mock Manager lookup for Role Guard
            // 2. Mock TableModel.findAll to find available table
            // 3. Mock TableModel.assignCustomer (update)

            (pool.query as jest.Mock)
                .mockResolvedValueOnce([[{ id: 1, role: 'MANAGER' }]]) // Role guard
                .mockResolvedValueOnce([[{ id: 10, status: 'AVAILABLE', table_number: 5 }]]) // Find all tables
                .mockResolvedValueOnce([{ affectedRows: 1 }]); // Update table

            // Note: Queue state is in-memory. We need to ensure queue has someone.
            // Since tests run in same process/memory space as app import? 
            // Jest resets modules between test files, but within file it persists?
            // Actually, `app` is imported once. The queue array in `queue.controller.ts` is static.
            // So the previous test 'join queue' added user 2.
            // So user 2 should be in queue.

            const res = await request(app)
                .post('/queue/seat')
                .set('x-user-id', '1');

            expect(res.status).toBe(200);
            expect(res.body.data.userId).toBe(2);
            expect(res.body.data.tableId).toBe(10);
        });
    });
});
