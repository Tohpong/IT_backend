// /backend/routes/course_routes.js
import { Router } from 'express';
import { pool } from '../lib/db.js';

const router = Router();

/** GET /course - ดูข้อมูลทั้งหมด */
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM `Course`');
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.code || 'DB error' });
  }
});

/** GET /course/:id - ดูข้อมูลเฉพาะ */
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM `Course` WHERE `course_id` = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.code || 'DB error' });
  }
});

/** POST /course - สร้าง Course ใหม่ (course_id จะสร้างอัตโนมัติ) */
router.post('/', async (req, res) => {
  try {
    const { course_name, img_url, date, account_id } = req.body;

    // ตรวจสอบว่ามีข้อมูลที่จำเป็น
    if (!course_name || !date || !account_id) {
      return res.status(400).json({ error: 'course_name, date, account_id ต้องไม่ว่าง' });
    }

    // สร้าง course ใหม่
    const [result] = await pool.query(
      'INSERT INTO `Course` (`course_name`, `img_url`, `date`, `account_id`) VALUES (?, ?, ?, ?)',
      [course_name, img_url ?? null, date, account_id]
    );

    const newId = result.insertId; // course_id จะถูกสร้างอัตโนมัติ
    const [rows] = await pool.query('SELECT * FROM `Course` WHERE `course_id` = ?', [newId]);
    res.status(201).json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.code || 'DB error', message: e.sqlMessage });
  }
});

/** PUT /course/:id - อัปเดตข้อมูลทั้งหมด (ยกเว้น course_id) */
router.put('/:id', async (req, res) => {
  try {
    const { course_name, img_url, date, account_id } = req.body;

    // ตรวจสอบว่ามีข้อมูลที่จำเป็น
    if (!course_name || !date || !account_id) {
      return res.status(400).json({ error: 'course_name, date, account_id ต้องไม่ว่าง' });
    }

    // อัปเดตข้อมูลทั้งหมด
    const [result] = await pool.query(
      'UPDATE `Course` SET `course_name` = ?, `img_url` = ?, `date` = ?, `account_id` = ? WHERE `course_id` = ?',
      [course_name, img_url ?? null, date, account_id, req.params.id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });

    const [rows] = await pool.query('SELECT * FROM `Course` WHERE `course_id` = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.code || 'DB error', message: e.sqlMessage });
  }
});

/** PATCH /course/:id - อัปเดตข้อมูลบางส่วน (ยกเว้น course_id) */
router.patch('/:id', async (req, res) => {
  try {
    const allowedFields = ['course_name', 'img_url', 'date', 'account_id'];
    const fields = [];
    const values = [];

    // เช็กและจัดการข้อมูลที่สามารถอัปเดตได้
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        fields.push(`${field} = ?`);
        values.push(req.body[field]);
      }
    }

    // ถ้าไม่มีฟิลด์ให้แก้ไข
    if (!fields.length) {
      return res.status(400).json({ error: 'ไม่มีฟิลด์ให้อัปเดต' });
    }

    values.push(req.params.id); // course_id สำหรับ WHERE clause

    // อัปเดตข้อมูลที่ต้องการ
    const [result] = await pool.query(
      `UPDATE \`Course\` SET ${fields.join(', ')} WHERE \`course_id\` = ?`,
      values
    );

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });

    const [rows] = await pool.query('SELECT * FROM `Course` WHERE `course_id` = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.code || 'DB error', message: e.sqlMessage });
  }
});

/** DELETE /course/:id - ลบข้อมูลตาม course_id */
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM `Course` WHERE `course_id` = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ deleted: true, id: req.params.id });
  } catch (e) {
    // ถ้าติด Foreign Key (มีข้อมูลที่อ้างอิงไป) จะได้ ER_ROW_IS_REFERENCED_2 (1451)
    if (e.code === 'ER_ROW_IS_REFERENCED_2' || e.errno === 1451) {
      return res.status(409).json({
        error: 'FK_CONFLICT',
        message: 'ลบไม่ได้เพราะมีข้อมูลอื่นอ้างถึง (เช่น Member หรือ Trainer)',
      });
    }
    console.error(e);
    res.status(500).json({ error: e.code || 'DB error', message: e.sqlMessage });
  }
});

export default router;

