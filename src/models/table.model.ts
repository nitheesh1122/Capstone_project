import { pool } from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface RestaurantTable {
    id?: number;
    table_number: number;
    capacity: number;
    type: 'REGULAR' | 'VIP';
    status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED';
    current_customer_id?: number | null;
    reservation_time?: Date | null;
}

export const createRestaurantTableTable = async () => {
    const query = `
    CREATE TABLE IF NOT EXISTS restaurant_tables (
      id INT PRIMARY KEY AUTO_INCREMENT,
      table_number INT NOT NULL,
      capacity INT NOT NULL,
      type ENUM('REGULAR','VIP') NOT NULL,
      status ENUM('AVAILABLE','OCCUPIED','RESERVED') NOT NULL,
      current_customer_id INT NULL,
      reservation_time DATETIME NULL
    )
  `;
    await pool.query(query);
};

export const TableModel = {
    create: async (table: RestaurantTable): Promise<RestaurantTable> => {
        const query = 'INSERT INTO restaurant_tables (table_number, capacity, type, status) VALUES (?, ?, ?, ?)';
        const [result] = await pool.query<ResultSetHeader>(query, [table.table_number, table.capacity, table.type, table.status]);
        return { id: result.insertId, ...table };
    },

    findAll: async (): Promise<RestaurantTable[]> => {
        const query = 'SELECT * FROM restaurant_tables';
        const [rows] = await pool.query<RowDataPacket[]>(query);
        return rows as RestaurantTable[];
    },

    findById: async (id: number): Promise<RestaurantTable | null> => {
        const query = 'SELECT * FROM restaurant_tables WHERE id = ?';
        const [rows] = await pool.query<RowDataPacket[]>(query, [id]);
        return (rows[0] as RestaurantTable) || null;
    },

    update: async (id: number, table: Partial<RestaurantTable>): Promise<boolean> => {
        const query = 'UPDATE restaurant_tables SET ? WHERE id = ?';
        const [result] = await pool.query<ResultSetHeader>(query, [table, id]);
        return result.affectedRows > 0;
    },

    delete: async (id: number): Promise<boolean> => {
        const query = 'DELETE FROM restaurant_tables WHERE id = ?';
        const [result] = await pool.query<ResultSetHeader>(query, [id]);
        return result.affectedRows > 0;
    },

    updateStatus: async (id: number, status: string): Promise<boolean> => {
        const query = 'UPDATE restaurant_tables SET status = ? WHERE id = ?';
        const [result] = await pool.query<ResultSetHeader>(query, [status, id]);
        return result.affectedRows > 0;
    },

    assignCustomer: async (id: number, customerId: number): Promise<boolean> => {
        const query = 'UPDATE restaurant_tables SET current_customer_id = ?, status = "OCCUPIED" WHERE id = ?';
        const [result] = await pool.query<ResultSetHeader>(query, [customerId, id]);
        return result.affectedRows > 0;
    },

    reserve: async (id: number, reservationTime: Date): Promise<boolean> => {
        const query = 'UPDATE restaurant_tables SET reservation_time = ?, status = "RESERVED" WHERE id = ?';
        const [result] = await pool.query<ResultSetHeader>(query, [reservationTime, id]);
        return result.affectedRows > 0;
    },

    cancelReservation: async (id: number): Promise<boolean> => {
        const query = 'UPDATE restaurant_tables SET reservation_time = NULL, status = "AVAILABLE" WHERE id = ?';
        const [result] = await pool.query<ResultSetHeader>(query, [id]);
        return result.affectedRows > 0;
    }
};
