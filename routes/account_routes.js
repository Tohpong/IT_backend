import { Router } from 'express';
import { pool } from '../lib/db.js';
import bcrypt from 'bcryptjs';

const router = Router();

// -----------------------------------------------------------------------------
// ✅ GET /account — ดึงข้อมูลทั้งหมด
// -----------------------------------------------------------------------------
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT account_id, username, email, role, account_pic FROM `Account`'
    );
    res.json(rows);
  } catch (e) {
    console.error('Get all accounts error:', e);
    res.status(500).json({ error: e.code || 'DB error' });
  }
});

// -----------------------------------------------------------------------------
// ✅ LOGIN — เข้าสู่ระบบ
// -----------------------------------------------------------------------------
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน',
      });
    }

    const [rows] = await pool.query(
      'SELECT * FROM `Account` WHERE `username` = ?',
      [username]
    );

    if (!rows.length) {
      return res.status(401).json({
        success: false,
        message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',
      });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',
      });
    }

    delete user.password;

    res.json({
      success: true,
      message: 'เข้าสู่ระบบสำเร็จ',
      user,
    });
  } catch (e) {
    console.error('Login error:', e);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดของเซิร์ฟเวอร์',
    });
  }
});

// -----------------------------------------------------------------------------
// ✅ REGISTER — สมัครสมาชิกใหม่ (Account + Member)
// -----------------------------------------------------------------------------
router.post('/register', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { username, password, full_name, email, age, phone, birthdate, gender } = req.body;

    if (!username || !password || !full_name) {
      conn.release();
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอก username, password และชื่อ-นามสกุล',
      });
    }

    const [exists] = await conn.query(
      'SELECT * FROM `Account` WHERE `username` = ?',
      [username]
    );
    if (exists.length > 0) {
      conn.release();
      return res.status(409).json({
        success: false,
        message: 'ชื่อผู้ใช้นี้มีอยู่แล้วในระบบ',
      });
    }

    await conn.beginTransaction();

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const [resultAccount] = await conn.query(
      'INSERT INTO `Account` (`username`, `password`, `role`) VALUES (?, ?, ?)',
      [username, hashedPassword, 'user'] // default role
    );

    const account_id = resultAccount.insertId;

    await conn.query(
      `INSERT INTO Member (full_name, email, age, phone, birthdate, gender, account_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [full_name, email || '', age || 0, phone || '', birthdate || null, gender || '', account_id]
    );

    await conn.commit();
    conn.release();

    res.json({
      success: true,
      message: 'สมัครสมาชิกสำเร็จ',
      account_id,
    });
  } catch (e) {
    await conn.rollback();
    conn.release();
    console.error('Register error:', e);
    res.status(500).json({
      success: false,
      message: e.sqlMessage || 'เกิดข้อผิดพลาดของเซิร์ฟเวอร์',
    });
  }
});

// -----------------------------------------------------------------------------
// ✅ GET /account/:id — ดึงข้อมูลรายบุคคล
// -----------------------------------------------------------------------------
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT account_id, username, email, role, account_pic FROM `Account` WHERE `account_id` = ?',
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (e) {
    console.error('Get account by id error:', e);
    res.status(500).json({ error: e.code || 'DB error' });
  }
});

// -----------------------------------------------------------------------------
// ✅ POST /account — สร้างบัญชีใหม่ (Admin ใช้สร้าง)
// -----------------------------------------------------------------------------
router.post('/', async (req, res) => {
  try {
    const { account_pic = null, username, password, email = '', role = 'user' } =
      req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'username และ password จำเป็น' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO `Account` (`account_pic`, `username`, `password`, `email`, `role`) VALUES (?, ?, ?, ?, ?)',
      [account_pic, username, hashedPassword, email, role]
    );

    const newId = result.insertId;
    const [rows] = await pool.query(
      'SELECT account_id, username, email, role, account_pic FROM `Account` WHERE `account_id` = ?',
      [newId]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    console.error('Create account error:', e);
    res.status(500).json({ error: e.code || 'DB error', message: e.sqlMessage });
  }
});

// -----------------------------------------------------------------------------
// ✅ PUT /account/:id — แก้ไขข้อมูลทั้งหมด (แทนที่ทั้งระเบียน)
// -----------------------------------------------------------------------------
router.put('/:id', async (req, res) => {
  try {
    const {
      account_pic = null,
      username,
      password,
      email = '',
      role = 'user',
    } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'username และ password จำเป็น' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'UPDATE `Account` SET `account_pic`=?, `username`=?, `password`=?, `email`=?, `role`=? WHERE `account_id`=?',
      [account_pic, username, hashedPassword, email, role, req.params.id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ error: 'Not found' });

    const [rows] = await pool.query(
      'SELECT account_id, username, email, role, account_pic FROM `Account` WHERE `account_id`=?',
      [req.params.id]
    );
    res.json(rows[0]);
  } catch (e) {
    console.error('Update account error:', e);
    res.status(500).json({ error: e.code || 'DB error', message: e.sqlMessage });
  }
});

// -----------------------------------------------------------------------------
// ✅ PATCH /account/:id — อัปเดตบางฟิลด์
// -----------------------------------------------------------------------------
router.patch('/:id', async (req, res) => {
  try {
    const allowed = ['account_pic', 'username', 'password', 'email', 'role'];
    const fields = [];
    const values = [];

    for (const k of allowed) {
      if (req.body[k] !== undefined) {
        if (k === 'password') {
          const hashed = await bcrypt.hash(req.body[k], 10);
          fields.push('`password` = ?');
          values.push(hashed);
        } else {
          fields.push('`' + k + '` = ?');
          values.push(req.body[k]);
        }
      }
    }

    if (!fields.length)
      return res.status(400).json({ error: 'ไม่มีฟิลด์ให้อัปเดต' });

    values.push(req.params.id);

    const [result] = await pool.query(
      `UPDATE \`Account\` SET ${fields.join(', ')} WHERE \`account_id\` = ?`,
      values
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ error: 'Not found' });

    const [rows] = await pool.query(
      'SELECT account_id, username, email, role, account_pic FROM `Account` WHERE `account_id`=?',
      [req.params.id]
    );
    res.json(rows[0]);
  } catch (e) {
    console.error('Patch account error:', e);
    res.status(500).json({ error: e.code || 'DB error', message: e.sqlMessage });
  }
});

// -----------------------------------------------------------------------------
// ✅ DELETE /account/:id — ลบผู้ใช้
// -----------------------------------------------------------------------------
router.delete('/:id', async (req, res) => {
  const accountId = req.params.id;

  try {
    // 🔹 เริ่ม Transaction เพื่อให้แน่ใจว่าลบครบทุกตาราง หรือไม่ลบเลยถ้าเกิด error
    await pool.query('START TRANSACTION');

    // 1️⃣ ลบข้อมูลที่เกี่ยวข้องใน Member, Course, Trainer ก่อน
    await pool.query('DELETE FROM Member WHERE account_id = ?', [accountId]);
    await pool.query('DELETE FROM Course WHERE account_id = ?', [accountId]);
    await pool.query('DELETE FROM Trainer WHERE account_id = ?', [accountId]);

    // 2️⃣ ลบข้อมูลใน Account หลังสุด
    const [result] = await pool.query('DELETE FROM Account WHERE account_id = ?', [accountId]);

    // 3️⃣ ตรวจสอบว่ามีแถวถูกลบจริงไหม
    if (result.affectedRows === 0) {
      await pool.query('ROLLBACK');
      return res.status(404).json({ error: 'Not found' });
    }

    // ✅ ทุกอย่างผ่าน — commit transaction
    await pool.query('COMMIT');

    res.json({ deleted: true, id: Number(accountId) });

  } catch (e) {
    // ❌ ถ้ามี error ให้ rollback transaction
    await pool.query('ROLLBACK');

    if (e.code === 'ER_ROW_IS_REFERENCED_2' || e.errno === 1451) {
      return res.status(409).json({
        error: 'FK_CONFLICT',
        message: 'ลบไม่ได้เพราะมีข้อมูลอื่นอ้างถึงบัญชีนี้ (Member/Course/Trainer)',
      });
    }

    console.error('Delete account error:', e);
    res.status(500).json({ error: e.code || 'DB error', message: e.sqlMessage });
  }
});

// ✅ GET /account/profile/:account_id — ดึงข้อมูลโปรไฟล์จาก Account + Member
router.get('/profile/:account_id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
         a.account_id,
         a.username,
         a.role,
         a.account_pic,
         m.member_id,
         m.full_name,
         m.email,
         m.age,
         m.phone,
         m.birthdate,
         m.gender
       FROM Account a
       JOIN Member m ON a.account_id = m.account_id
       WHERE a.account_id = ?`,
      [req.params.account_id]
    );

    if (!rows.length) {
      return res.status(404).json({ error: 'ไม่พบข้อมูลผู้ใช้' });
    }

    res.json(rows[0]);
  } catch (e) {
    console.error('Get profile error:', e);
    res.status(500).json({ error: e.code || 'DB error', message: e.sqlMessage });
  }
});

export default router;
