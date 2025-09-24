import mysql from 'mysql2/promise';
export const pool = mysql.createPool({
  host: process.env.DB_HOST ?? '127.0.0.1',
  port: Number(process.env.DB_PORT ?? 3307),
  user: process.env.DB_USER ?? 'app',
  password: process.env.DB_PASSWORD ?? '1234',
  database: process.env.DB_NAME ?? 'Trainer',
  waitForConnections: true,
  connectionLimit: 10,
});
