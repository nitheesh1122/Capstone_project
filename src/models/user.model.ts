import { pool } from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface User {
    id?: number;
    name: string;
    role: 'CUSTOMER' | 'MANAGER' | 'ADMIN';
    contact_info?: string;
    created_at?: Date;
}

export const createUserTable = async () => {
    const query = `
    CREATE TABLE IF NOT EXISTS users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(100) NOT NULL,
      role ENUM('CUSTOMER','MANAGER','ADMIN') NOT NULL,
      contact_info VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
    await pool.query(query);
};

export const UserModel = {
    create: async (user: User): Promise<User> => {
        const query = 'INSERT INTO users (name, role, contact_info) VALUES (?, ?, ?)';
        const [result] = await pool.query<ResultSetHeader>(query, [user.name, user.role, user.contact_info]);
        return { id: result.insertId, ...user };
    },

    findById: async (id: number): Promise<User | null> => {
        const query = 'SELECT * FROM users WHERE id = ?';
        const [rows] = await pool.query<RowDataPacket[]>(query, [id]);
        return (rows[0] as User) || null;
    }
};
