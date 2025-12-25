const mysql = require('mysql2/promise');

(async () => {
    console.log("Testing connection to 127.0.0.1...");
    try {
        const conn = await mysql.createConnection({
            host: '127.0.0.1',
            user: 'root',
            password: '',
            port: 3306,
            connectTimeout: 5000 // 5s timeout
        });
        console.log("✅ Success connecting to 127.0.0.1!");
        await conn.end();
    } catch (e) {
        console.log("❌ Failed 127.0.0.1:", e.message);
    }

    console.log("Testing connection to localhost...");
    try {
        const conn = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            port: 3306,
            connectTimeout: 5000
        });
        console.log("✅ Success connecting to localhost!");
        await conn.end();
    } catch (e) {
        console.log("❌ Failed localhost:", e.message);
    }
})();
