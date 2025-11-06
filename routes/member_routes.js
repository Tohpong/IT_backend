// /backend/routes/member_routes.js
import { Router } from 'express';
import { pool } from '../lib/db.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

// ==============================
// Multer config for profile uploads
// ==============================
const uploadDir = './uploads/profile';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// ==============================
// GET /member -> all members
// ==============================
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Member');
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'DB error' });
  }
});

// ==============================
// GET /member/:id -> member details (JOIN Enrollment + Account)
// ==============================
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
         m.member_id, m.full_name, m.email, m.age, m.phone, m.birthdate, m.gender,
         e.experience, e.goal, e.health,
         a.username, a.account_pic
       FROM Member m
       JOIN Account a ON m.account_id = a.account_id
       LEFT JOIN Enrollment e ON m.member_id = e.member_id
       WHERE m.member_id = ?`,
      [req.params.id]
    );

    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'DB error', message: e.sqlMessage || e.message });
  }
});

// ==============================
// POST /member/upload/:account_id -> upload profile image
// ==============================
router.post('/upload/:account_id', upload.single('profileImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'ไม่มีไฟล์ที่อัปโหลด' });
    }

    const filePath = `/uploads/profile/${req.file.filename}`;

    const [result] = await pool.query(
      `UPDATE Account SET account_pic = ? WHERE account_id = ?`,
      [filePath, req.params.account_id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ error: 'ไม่พบผู้ใช้' });

    res.json({
      success: true,
      message: 'อัปโหลดรูปโปรไฟล์สำเร็จ',
      imageUrl: filePath
    });
  } catch (e) {
    console.error('upload error:', e);
    res.status(500).json({ error: e.code || 'DB error', message: e.sqlMessage });
  }
});

// ==============================
// PUT /member/:id -> update Member + Enrollment
// ==============================
router.put('/:id', async (req, res) => {
  try {
    const {
      full_name, email, age, phone, birthdate, gender, account_id,
      experience = null, goal = null, health = null
    } = req.body;

    if ([full_name, age, phone, gender, account_id].some(v => v == null)) {
      return res.status(400).json({ error: 'full_name, age, phone, gender, account_id ต้องไม่ว่าง' });
    }

    // update Member info
    await pool.query(
      `UPDATE Member
       SET full_name = ?, email = ?, age = ?, phone = ?, birthdate = ?, gender = ?, account_id = ?
       WHERE member_id = ?`,
      [full_name, email ?? null, age, phone, birthdate ?? null, gender, account_id, req.params.id]
    );

    // update Enrollment info (ถ้ามี)
    await pool.query(
      `UPDATE Enrollment
       SET experience = ?, goal = ?, health = ?
       WHERE member_id = ?`,
      [experience, goal, health, req.params.id]
    );

    // ดึงข้อมูลกลับ
    const [rows] = await pool.query(
      `SELECT 
         m.member_id, m.full_name, m.email, m.age, m.phone, m.birthdate, m.gender,
         e.experience, e.goal, e.health,
         a.username, a.account_pic
       FROM Member m
       JOIN Account a ON m.account_id = a.account_id
       LEFT JOIN Enrollment e ON m.member_id = e.member_id
       WHERE m.member_id = ?`,
      [req.params.id]
    );

    res.json(rows[0]);
  } catch (e) {
    console.error('PUT member error:', e);
    res.status(500).json({ error: e.code || 'DB error', message: e.sqlMessage });
  }
});

// ==============================
// PATCH /member/:id -> partial update
// ==============================
router.patch('/:id', async (req, res) => {
  try {
    const allowedMember = ['full_name', 'email', 'age', 'phone', 'birthdate', 'gender', 'account_id'];
    const allowedEnroll = ['experience', 'goal', 'health'];

    const memberFields = [];
    const memberValues = [];
    const enrollFields = [];
    const enrollValues = [];

    for (const key of allowedMember) {
      if (req.body[key] !== undefined) {
        memberFields.push(`${key} = ?`);
        memberValues.push(req.body[key]);
      }
    }

    for (const key of allowedEnroll) {
      if (req.body[key] !== undefined) {
        enrollFields.push(`${key} = ?`);
        enrollValues.push(req.body[key]);
      }
    }

    // update Member
    if (memberFields.length) {
      memberValues.push(req.params.id);
      await pool.query(
        `UPDATE Member SET ${memberFields.join(', ')} WHERE member_id = ?`,
        memberValues
      );
    }

    // update Enrollment
    if (enrollFields.length) {
      enrollValues.push(req.params.id);
      await pool.query(
        `UPDATE Enrollment SET ${enrollFields.join(', ')} WHERE member_id = ?`,
        enrollValues
      );
    }

    const [rows] = await pool.query(
      `SELECT 
         m.member_id, m.full_name, m.email, m.age, m.phone, m.birthdate, m.gender,
         e.experience, e.goal, e.health,
         a.username, a.account_pic
       FROM Member m
       JOIN Account a ON m.account_id = a.account_id
       LEFT JOIN Enrollment e ON m.member_id = e.member_id
       WHERE m.member_id = ?`,
      [req.params.id]
    );

    res.json(rows[0]);
  } catch (e) {
    console.error('PATCH member error:', e);
    res.status(500).json({ error: e.code || 'DB error', message: e.sqlMessage });
  }
});

// ==============================
// DELETE /member/:id
// ==============================
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM Member WHERE member_id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ deleted: true, id: Number(req.params.id) });
  } catch (e) {
    console.error(e);
    res.status(409).json({ error: e.code || 'FK constraint', message: e.sqlMessage });
  }
});

// ==============================
// GET /member/by-account/:account_id
// ==============================
router.get('/by-account/:account_id', async (req, res) => {
  const { account_id } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT 
         m.member_id, m.full_name, m.email, m.age, m.phone, m.birthdate, m.gender,
         e.experience, e.goal, e.health
       FROM Member m
       LEFT JOIN Enrollment e ON m.member_id = e.member_id
       WHERE m.account_id = ?`,
      [account_id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: 'ไม่พบข้อมูลสมาชิกของ account_id นี้' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('❌ ดึงข้อมูล Member ผิดพลาด:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
