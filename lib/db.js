import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'Trainer',
  waitForConnections: true,
  connectionLimit: 10,
  ssl: { rejectUnauthorized: true },
});

// ✅ ทดสอบการเชื่อมต่อ (debug log)
try {
  const conn = await pool.getConnection();
  console.log('✅ Connected to MySQL:', process.env.DB_HOST, process.env.DB_NAME);
  conn.release();
} catch (err) {
  console.error('❌ Database connection failed:', err.message);
}
