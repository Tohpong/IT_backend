// /backend/routes/course_routes.js
import { Router } from 'express';
import { pool } from '../lib/db.js';

const router = Router();

/** ✅ GET /course - ดึงข้อมูลคอร์สทั้งหมด */
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        c.*, 
        t.trainer_fullname AS trainer_name
      FROM Course c
      LEFT JOIN Trainer t ON c.trainer_id = t.trainer_id
      ORDER BY c.course_id DESC
    `);
    res.json(rows);
  } catch (e) {
    console.error('❌ Error loading courses:', e);
    res.status(500).json({ error: e.code || 'DB error' });
  }
});

/** ✅ GET /course/:id - ดึงข้อมูลคอร์สเฉพาะ */
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT 
        c.*, 
        t.trainer_fullname AS trainer_name
      FROM Course c
      LEFT JOIN Trainer t ON c.trainer_id = t.trainer_id
      WHERE c.course_id = ?
      `,
      [req.params.id]
    );

    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (e) {
    console.error('❌ Error fetching course:', e);
    res.status(500).json({ error: e.code || 'DB error' });
  }
});

/** ✅ POST /course - เพิ่มคอร์สใหม่ */
router.post('/', async (req, res) => {
  try {
    const {
      course_name,
      img_url,
      description,
      price,
      level,
      tags,
      duration,
      trainer_id // optional
    } = req.body;

    if (!course_name || !description || price == null || !level || !tags || !duration) {
      return res.status(400).json({
        error: 'กรุณากรอกข้อมูลให้ครบ: course_name, description, price, level, tags, duration'
      });
    }

    const [result] = await pool.query(
      `INSERT INTO Course
      (course_name, img_url, description, price, level, tags, duration, trainer_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [course_name, img_url ?? null, description, price, level, tags, duration, trainer_id ?? null]
    );

    const [rows] = await pool.query(`
      SELECT c.*, t.trainer_fullname AS trainer_name
      FROM Course c
      LEFT JOIN Trainer t ON c.trainer_id = t.trainer_id
      WHERE c.course_id = ?
    `, [result.insertId]);

    res.status(201).json(rows[0]);
  } catch (e) {
    console.error('❌ Error creating course:', e);
    res.status(500).json({ error: e.code || 'DB error', message: e.sqlMessage });
  }
});

/** ✅ PUT /course/:id - อัปเดตข้อมูลคอร์ส */
router.put('/:id', async (req, res) => {
  try {
    const {
      course_name,
      img_url,
      description,
      price,
      level,
      tags,
      duration,
      trainer_id // optional
    } = req.body;

    if (!course_name || !description || price == null || !level || !tags || !duration) {
      return res.status(400).json({
        error: 'กรุณากรอกข้อมูลให้ครบ: course_name, description, price, level, tags, duration'
      });
    }

    const [result] = await pool.query(
      `UPDATE Course
       SET course_name=?, img_url=?, description=?, price=?, level=?, tags=?, duration=?, trainer_id=?
       WHERE course_id=?`,
      [course_name, img_url ?? null, description, price, level, tags, duration, trainer_id ?? null, req.params.id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });

    const [rows] = await pool.query(`
      SELECT c.*, t.trainer_fullname AS trainer_name
      FROM Course c
      LEFT JOIN Trainer t ON c.trainer_id = t.trainer_id
      WHERE c.course_id = ?
    `, [req.params.id]);

    res.json(rows[0]);
  } catch (e) {
    console.error('❌ Error updating course:', e);
    res.status(500).json({ error: e.code || 'DB error', message: e.sqlMessage });
  }
});

/** ✅ PATCH /course/:id - อัปเดตบางฟิลด์ของคอร์ส */
router.patch('/:id', async (req, res) => {
  try {
    const allowedFields = [
      'course_name',
      'img_url',
      'description',
      'price',
      'level',
      'tags',
      'duration',
      'trainer_id'
    ];

    const fields = [];
    const values = [];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        fields.push(`${field} = ?`);
        values.push(req.body[field]);
      }
    }

    if (!fields.length) {
      return res.status(400).json({ error: 'ไม่มีฟิลด์ให้อัปเดต' });
    }

    values.push(req.params.id);

    const [result] = await pool.query(
      `UPDATE Course SET ${fields.join(', ')} WHERE course_id = ?`,
      values
    );

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });

    const [rows] = await pool.query(`
      SELECT c.*, t.trainer_fullname AS trainer_name
      FROM Course c
      LEFT JOIN Trainer t ON c.trainer_id = t.trainer_id
      WHERE c.course_id = ?
    `, [req.params.id]);

    res.json(rows[0]);
  } catch (e) {
    console.error('❌ Error patching course:', e);
    res.status(500).json({ error: e.code || 'DB error', message: e.sqlMessage });
  }
});

/** ✅ DELETE /course/:id - ลบคอร์ส */
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM Course WHERE course_id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ deleted: true, id: Number(req.params.id) });
  } catch (e) {
    console.error('❌ Error deleting course:', e);
    res.status(500).json({ error: e.code || 'DB error', message: e.sqlMessage });
  }
});

export default router;
