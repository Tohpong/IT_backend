// /backend/routes/trainer_routes.js
import { Router } from 'express';
import { pool } from '../lib/db.js';

const router = Router();

/** ✅ GET /trainer - ดูข้อมูลเทรนเนอร์ทั้งหมด (พร้อมชื่อคอร์ส) */
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        t.trainer_id,
        t.trainer_fullname,
        t.trainer_age,
        t.trainer_year,
        t.trainer_bio,
        t.trainer_url,
        t.schedule,
        t.rating,
        c.course_name
      FROM Trainer t
      LEFT JOIN Course c ON t.course_id = c.course_id
    `);
    res.json(rows);
  } catch (e) {
    console.error('GET /trainer error:', e);
    res.status(500).json({ error: e.code || 'DB error' });
  }
});

/** ✅ GET /trainer/:id - ดูข้อมูลเทรนเนอร์เฉพาะ (พร้อมชื่อคอร์ส) */
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        t.trainer_id,
        t.trainer_fullname,
        t.trainer_age,
        t.trainer_year,
        t.trainer_bio,
        t.trainer_url,
        t.schedule,
        t.rating,
        t.trainer_email,
        t.trainer_phone,
        c.course_name   -- ✅ ต้องมีบรรทัดนี้!
      FROM Trainer t
      LEFT JOIN Course c ON t.course_id = c.course_id
      WHERE t.trainer_id = ?
`, [req.params.id]);

    if (!rows.length) {
      return res.status(404).json({ error: 'Not found' });
    }

    res.json(rows[0]);
  } catch (e) {
    console.error('GET /trainer/:id error:', e);
    res.status(500).json({ error: e.code || 'DB error' });
  }
});

/** ✅ POST /trainer - เพิ่มข้อมูล Trainer ใหม่ (สร้าง Account อัตโนมัติ) */
router.post('/', async (req, res) => {
  try {
    const {
      trainer_fullname,
      trainer_age,
      trainer_date,
      trainer_year,
      trainer_bio,
      trainer_url,
      schedule,
      rating,
      trainer_email,
      trainer_phone,
      course_id
    } = req.body;

    if (!trainer_fullname || !trainer_date) {
      return res.status(400).json({ error: 'trainer_fullname และ trainer_date ต้องไม่ว่าง' });
    }

    // ✅ 1. สร้าง account อัตโนมัติ (แทน account_name ด้วย username)
    const username = trainer_fullname.replace(/\s+/g, '').toLowerCase(); // ex. Kru ZomO → kruzomo
    const password = '123456'; // ตั้งค่า default password
    const role = 'trainer';

    const [accountResult] = await pool.query(
      `INSERT INTO Account (username, password, role) VALUES (?, ?, ?)`,
      [username, password, role]
    );

    const account_id = accountResult.insertId; // ดึง id ของ account ที่เพิ่งสร้าง

    // ✅ 2. เพิ่มข้อมูล Trainer โดยผูกกับ account_id ที่เพิ่งสร้าง
    const [result] = await pool.query(
      `INSERT INTO Trainer 
        (trainer_fullname, trainer_age, trainer_date, trainer_year, trainer_bio, 
         trainer_url, schedule, rating, trainer_email, trainer_phone, account_id, course_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        trainer_fullname,
        trainer_age ?? null,
        trainer_date,
        trainer_year ?? '',
        trainer_bio ?? '',
        trainer_url ?? '',
        schedule ?? '',
        rating ?? 0,
        trainer_email ?? '',
        trainer_phone ?? '',
        account_id,
        course_id ?? null
      ]
    );

    const [rows] = await pool.query('SELECT * FROM Trainer WHERE trainer_id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (e) {
    console.error('POST /trainer error:', e);
    res.status(500).json({ error: e.code || 'DB error', message: e.sqlMessage });
  }
});


/** ✅ PUT /trainer/:id - อัปเดตข้อมูลทั้งหมด */
router.put('/:id', async (req, res) => {
  try {
    const {
      trainer_fullname,
      trainer_age,
      trainer_date,
      trainer_year,
      trainer_bio,
      trainer_url,
      schedule,
      rating,
      account_id,
      course_id
    } = req.body;

    if (!trainer_fullname || !trainer_date) {
      return res.status(400).json({ error: 'trainer_fullname และ trainer_date ต้องไม่ว่าง' });
    }

    const [result] = await pool.query(
      `UPDATE Trainer SET 
        trainer_fullname = ?, trainer_age = ?, trainer_date = ?, 
        trainer_year = ?, trainer_bio = ?, trainer_url = ?, 
        schedule = ?, rating = ?, account_id = ?, course_id = ?
       WHERE trainer_id = ?`,
      [
        trainer_fullname,
        trainer_age ?? null,
        trainer_date,
        trainer_year ?? '',
        trainer_bio ?? '',
        trainer_url ?? '',
        schedule ?? '',
        rating ?? 0,
        account_id,
        course_id ?? null,
        req.params.id
      ]
    );

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });

    const [rows] = await pool.query('SELECT * FROM `Trainer` WHERE `trainer_id` = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (e) {
    console.error('PUT /trainer error:', e);
    res.status(500).json({ error: e.code || 'DB error', message: e.sqlMessage });
  }
});

/** ✅ PATCH /trainer/:id - อัปเดตข้อมูลบางส่วน */
router.patch('/:id', async (req, res) => {
  try {
    const allowedFields = [
      'trainer_fullname', 'trainer_age', 'trainer_date',
      'trainer_year', 'trainer_bio', 'trainer_url',
      'schedule', 'rating', 'account_id', 'course_id'
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
      `UPDATE Trainer SET ${fields.join(', ')} WHERE trainer_id = ?`,
      values
    );

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });

    const [rows] = await pool.query('SELECT * FROM Trainer WHERE trainer_id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (e) {
    console.error('PATCH /trainer error:', e);
    res.status(500).json({ error: e.code || 'DB error', message: e.sqlMessage });
  }
});

/** ✅ DELETE /trainer/:id - ลบข้อมูล */
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM `Trainer` WHERE `trainer_id` = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ deleted: true, id: req.params.id });
  } catch (e) {
    if (e.code === 'ER_ROW_IS_REFERENCED_2' || e.errno === 1451) {
      return res.status(409).json({
        error: 'FK_CONFLICT',
        message: 'ลบไม่ได้เพราะมีข้อมูลอื่นอ้างถึง (เช่น Course)',
      });
    }
    console.error('DELETE /trainer error:', e);
    res.status(500).json({ error: e.code || 'DB error', message: e.sqlMessage });
  }
});

export default router;
