import app from './app';
import pool from './config/database';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        // Test Database Connection
        const connection = await pool.getConnection();
        console.log('✅ Database connected successfully');
        connection.release();

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
};

startServer();
