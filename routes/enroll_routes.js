// /backend/routes/enroll_routes.js
import { Router } from 'express';
import { pool } from '../lib/db.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const {
      member_id,
      course_id,
      full_name,
      email,
      phone,
      experience,
      goals,
      medical_conditions,
      payment_method,
      enrollment_date,
      price
    } = req.body;

    // ✅ แปลงวันที่ให้เป็น format ที่ MySQL รองรับ
    let formattedDate = null;
    if (enrollment_date) {
      // แปลงจาก ISO string เช่น "2025-10-31T13:57:03.256Z"
      // -> เป็น "2025-10-31 13:57:03.256"
      formattedDate = new Date(enrollment_date).toISOString().slice(0, 23).replace('T', ' ');
    }

    // ✅ บันทึกข้อมูลลงตาราง Enrollment
    const [result] = await pool.query(
      `INSERT INTO Enrollment (
          member_id, course_id, experience, goal, health,
          payment_method, enrollment_date, price, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
      [
        member_id,
        course_id,
        experience,
        goals,
        medical_conditions, // map ไปเก็บในคอลัมน์ health
        payment_method,
        formattedDate, // ✅ ใช้ค่าที่แปลงแล้ว
        price
      ]
    );

    res.json({ message: 'Enrollment saved successfully', id: result.insertId });
  } catch (err) {
    console.error('Enroll error:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

/*
router.post('/', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const {
      member_id,
      course_id,
      price = null,
      enrollment_date = null,
      experience = null,
      goals = null,
      goal = null,
      medical_conditions = null,
      health = null,
      payment_method = null
    } = req.body;

    if (!member_id || !course_id) {
      conn.release();
      return res.status(400).json({ error: 'member_id และ course_id จำเป็น' });
    }

    // Normalize
    const finalGoal = goal ?? goals ?? null;
    const finalHealth = health ?? medical_conditions ?? null;

    await conn.beginTransaction();

    const [insertRes] = await conn.query(
      `INSERT INTO Enrollment
        (member_id, course_id, enrollment_date, experience, goal, health, payment_method, price, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
      [
        member_id,
        course_id,
        enrollment_date ? new Date(enrollment_date) : new Date(),
        experience ?? null,
        finalGoal,
        finalHealth,
        payment_method ?? null,
        price ?? null
      ]
    );

    // Update Member profile fields if provided
    const fieldsToUpdate = [];
    const vals = [];

    if (experience !== undefined && experience !== null) {
      fieldsToUpdate.push('experience = ?');
      vals.push(experience);
    }
    if (finalGoal !== undefined && finalGoal !== null) {
      fieldsToUpdate.push('goal = ?');
      vals.push(finalGoal);
    }
    if (finalHealth !== undefined && finalHealth !== null) {
      fieldsToUpdate.push('health = ?');
      vals.push(finalHealth);
    }

    if (fieldsToUpdate.length) {
      vals.push(member_id);
      await conn.query(
        `UPDATE Member SET ${fieldsToUpdate.join(', ')} WHERE member_id = ?`,
        vals
      );
    }

    await conn.commit();
    conn.release();

    // Return the created enrollment row
    const [rows] = await pool.query(
      `SELECT e.*, m.full_name AS studentName, m.email, m.phone
       FROM Enrollment e
       LEFT JOIN Member m ON e.member_id = m.member_id
       WHERE e.enrollment_id = ?`,
      [insertRes.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (e) {
    await conn.rollback();
    conn.release();
    console.error('Enroll error:', e);
    res.status(500).json({ error: e.code || 'DB_ERROR', message: e.sqlMessage || e.message });
  }
});
*/

/**
 * GET /enroll/member/:member_id  -> ดึงประวัติการสมัครของ member ทั้งหมด (เรียงล่าสุดก่อน)
 */
router.get('/member/:member_id', async (req, res) => {
  try {
    const memberId = req.params.member_id;
    const [rows] = await pool.query(
      `SELECT e.*, c.course_name AS courseName, c.price AS coursePrice, m.full_name AS studentName, m.email, m.phone
       FROM Enrollment e
       LEFT JOIN Course c ON e.course_id = c.course_id
       LEFT JOIN Member m ON e.member_id = m.member_id
       WHERE e.member_id = ?
       ORDER BY e.enrollment_date DESC`,
      [memberId]
    );
    res.json(rows);
  } catch (e) {
    console.error('Get enrollments by member error:', e);
    res.status(500).json({ error: e.code || 'DB_ERROR', message: e.sqlMessage || e.message });
  }
});

/**
 * PATCH /enroll/:id/cancel  -> ยกเลิกการสมัคร (status = 'cancelled')
 */
router.patch('/:id/cancel', async (req, res) => {
  try {
    const [result] = await pool.query(
      `UPDATE Enrollment SET status = 'cancelled' WHERE enrollment_id = ?`,
      [req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    const [rows] = await pool.query(`SELECT * FROM Enrollment WHERE enrollment_id = ?`, [req.params.id]);
    res.json(rows[0]);
  } catch (e) {
    console.error('Cancel enrollment error:', e);
    res.status(500).json({ error: e.code || 'DB_ERROR', message: e.sqlMessage || e.message });
  }
});

/**
 * DELETE /enroll/:id  -> ลบการสมัคร (Minimal)
 */
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query(`DELETE FROM Enrollment WHERE enrollment_id = ?`, [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ deleted: true, id: Number(req.params.id) });
  } catch (e) {
    console.error('Delete enrollment error:', e);
    res.status(500).json({ error: e.code || 'DB_ERROR', message: e.sqlMessage || e.message });
  }
});

export default router;
