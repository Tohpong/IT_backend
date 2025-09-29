// /backend/routes/trainer_routes.js
import { Router } from 'express';
import { pool } from '../lib/db.js';

const router = Router();

/** GET /trainer - ดูข้อมูลทั้งหมด */
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM `Trainer`');
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.code || 'DB error' });
  }
});

/** GET /trainer/:id - ดูข้อมูลเฉพาะ */
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM `Trainer` WHERE `trainer_id` = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.code || 'DB error' });
  }
});

/** POST /trainer - สร้าง Trainer ใหม่ (trainer_id จะสร้างอัตโนมัติ) */
router.post('/', async (req, res) => {
  try {
    const { trainer_fullname, trainer_age, trainer_date, account_id } = req.body;

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!trainer_fullname || !trainer_date || !account_id) {
      return res.status(400).json({ error: 'trainer_fullname, trainer_date, account_id ต้องไม่ว่าง' });
    }

    // สร้าง trainer ใหม่
    const [result] = await pool.query(
      'INSERT INTO `Trainer` (`trainer_fullname`, `trainer_age`, `trainer_date`, `account_id`) VALUES (?, ?, ?, ?)',
      [trainer_fullname, trainer_age ?? null, trainer_date, account_id]
    );

    const newId = result.insertId; // trainer_id จะถูกสร้างอัตโนมัติ
    const [rows] = await pool.query('SELECT * FROM `Trainer` WHERE `trainer_id` = ?', [newId]);
    res.status(201).json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.code || 'DB error', message: e.sqlMessage });
  }
});

/** PUT /trainer/:id - อัปเดตข้อมูลทั้งหมด (ยกเว้น trainer_id) */
router.put('/:id', async (req, res) => {
  try {
    const { trainer_fullname, trainer_age, trainer_date, account_id } = req.body;

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!trainer_fullname || !trainer_date || !account_id) {
      return res.status(400).json({ error: 'trainer_fullname, trainer_date, account_id ต้องไม่ว่าง' });
    }

    // อัปเดตข้อมูลทั้งหมด
    const [result] = await pool.query(
      'UPDATE `Trainer` SET `trainer_fullname` = ?, `trainer_age` = ?, `trainer_date` = ?, `account_id` = ? WHERE `trainer_id` = ?',
      [trainer_fullname, trainer_age ?? null, trainer_date, account_id, req.params.id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });

    const [rows] = await pool.query('SELECT * FROM `Trainer` WHERE `trainer_id` = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.code || 'DB error', message: e.sqlMessage });
  }
});

/** PATCH /trainer/:id - อัปเดตข้อมูลบางส่วน (ยกเว้น trainer_id) */
router.patch('/:id', async (req, res) => {
  try {
    const allowedFields = ['trainer_fullname', 'trainer_age', 'trainer_date', 'account_id'];
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

    values.push(req.params.id); // trainer_id สำหรับ WHERE clause

    // อัปเดตข้อมูลที่ต้องการ
    const [result] = await pool.query(
      `UPDATE \`Trainer\` SET ${fields.join(', ')} WHERE \`trainer_id\` = ?`,
      values
    );

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });

    const [rows] = await pool.query('SELECT * FROM `Trainer` WHERE `trainer_id` = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.code || 'DB error', message: e.sqlMessage });
  }
});

/** DELETE /trainer/:id - ลบข้อมูลตาม trainer_id */
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM `Trainer` WHERE `trainer_id` = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ deleted: true, id: req.params.id });
  } catch (e) {
    // ถ้าติด Foreign Key (มีข้อมูลที่อ้างอิงไป) จะได้ ER_ROW_IS_REFERENCED_2 (1451)
    if (e.code === 'ER_ROW_IS_REFERENCED_2' || e.errno === 1451) {
      return res.status(409).json({
        error: 'FK_CONFLICT',
        message: 'ลบไม่ได้เพราะมีข้อมูลอื่นอ้างถึง (เช่น Course หรือ Member)',
      });
    }
    console.error(e);
    res.status(500).json({ error: e.code || 'DB error', message: e.sqlMessage });
  }
});

export default router;
