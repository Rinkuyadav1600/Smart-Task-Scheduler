const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Create table if it doesn't exist
const initDb = async () => {
    try {
        const connection = await pool.getConnection();
        // Since we need to create the database if it doesn't exist, we might need a separate connection first,
        // but typically the DB exists. Let's create the table.
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS tasks (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                deadline DATETIME NOT NULL,
                priority ENUM('Low', 'Medium', 'High') NOT NULL,
                status ENUM('pending', 'completed', 'overdue') DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        await connection.query(createTableQuery);
        console.log('Database initialized: tasks table ready.');
        connection.release();
    } catch (error) {
        console.error('Error initializing database:', error);
    }
};

initDb();

module.exports = pool;
