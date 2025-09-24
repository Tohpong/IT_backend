import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3307,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'Trainer',
});
// ดึงผู้ใช้ทั้งหมด
export const getAllMember = (req, res) => {
  db.query('SELECT member_id, full_name, age, phone, birthdate, gender, account_id FROM Member', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// ดึงผู้ใช้ตาม ID
export const getMemberById = (req, res) => {
  const { id } = req.params;
  db.query(
    'SELECT member_id, full_name, age, phone, birthdate, gender FROM member FROM Member WHERE member_id = ?',
    [id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (results.length === 0) return res.status(404).json({ message: 'User not found' });
      res.json(results[0]);
    }
  );
};

// เพิ่มผู้ใช้ใหม่ (รหัสผ่านไม่เข้ารหัส)
export const createMember = (req, res) => {
  const { member_id, full_name, age, phone, birthdate, gender } = req.body;
  db.query(
    'INSERT INTO users (member_id, full_name, age, phone, birthdate, gender) VALUES (?, ?, ?, ?, ?, ?)',
    [member_id, full_name, age, phone, birthdate, gender],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({ message: 'Member created', member_id });
    }
  );
};

// แก้ไขผู้ใช้
export const updateMember = (req, res) => {
  const { id } = req.params;
  const { full_name, age, phone, birthdate, gender } = req.body;

  db.query(
    'UPDATE users SET full_name = ?, age = ?, phone = ?, birthdate = ?, gender = ? WHERE member_id = ?',
    [full_name, age, phone, birthdate, gender, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Member updated' });
    }
  );
};

// ลบผู้ใช้
export const deleteMember = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM member WHERE member_id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Member deleted' });
  });
};

/*
// เข้าสู่ระบบ
export const loginUser = (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  
  db.query(
    'SELECT user_id, username, email, role, phone, address FROM users WHERE email = ? AND password = ?',
    [email, password],
    (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (results.length === 0) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      
      const user = results[0];
      res.json({ 
        message: 'Login successful',
        user: {
          user_id: user.user_id,
          username: user.username,
          email: user.email,
          role: user.role,
          phone: user.phone,
          address: user.address
        }
      });
    }
  );
};
*/



import { Router } from 'express';
import { pool } from '../lib/db.js';

const router = Router();

// GET /member  → ทั้งหมด
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Member');
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'DB error' });
  }
});

// GET /member/:id  → รายตัว
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT member_id, full_name, age, phone, birthdate, gender FROM Member WHERE member_id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'DB error' });
  }
});

export default router;
