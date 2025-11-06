import { Router } from 'express';
import { pool } from '../lib/db.js';
import bcrypt from 'bcryptjs';

const router = Router();

// -----------------------------------------------------------------------------
// ✅ GET /account — ดึงข้อมูลผู้ใช้ทั้งหมด
// -----------------------------------------------------------------------------
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT account_id, username, role FROM Account'
    );
    res.json(rows);
  } catch (e) {
    console.error('Get all accounts error:', e);
    res.status(500).json({ error: e.code || 'DB error' });
  }
});

// -----------------------------------------------------------------------------
// ✅ GET /account/:id — ดึงข้อมูลรายบุคคล
// -----------------------------------------------------------------------------
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT account_id, username, role FROM Account WHERE account_id = ?',
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
// ✅ POST /account/login — เข้าสู่ระบบ
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
      'SELECT * FROM Account WHERE username = ?',
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
// ✅ POST /account/register — สมัครสมาชิกใหม่ (Account + Member)
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
      'SELECT * FROM Account WHERE username = ?',
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

    const hashedPassword = await bcrypt.hash(password, 10);

    const [resultAccount] = await conn.query(
      'INSERT INTO Account (username, password, role) VALUES (?, ?, ?)',
      [username, hashedPassword, 'user']
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
// ✅ POST /account — เพิ่มผู้ใช้ใหม่ (Admin ใช้สร้าง)
// -----------------------------------------------------------------------------
router.post('/', async (req, res) => {
  try {
    const { username, password, email = '', role = 'user' } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'username และ password จำเป็น' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO Account (username, password, email, role) VALUES (?, ?, ?, ?)',
      [username, hashedPassword, email, role]
    );

    const newId = result.insertId;
    const [rows] = await pool.query(
      'SELECT account_id, username, email, role FROM Account WHERE account_id = ?',
      [newId]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    console.error('Create account error:', e);
    res.status(500).json({ error: e.code || 'DB error', message: e.sqlMessage });
  }
});

// -----------------------------------------------------------------------------
// ✅ PUT /account/:id — แก้ไขข้อมูลผู้ใช้
// -----------------------------------------------------------------------------
router.put('/:id', async (req, res) => {
  try {
    const { username, password, email = '', role = 'user' } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'username และ password จำเป็น' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'UPDATE Account SET username=?, password=?, email=?, role=? WHERE account_id=?',
      [username, hashedPassword, email, role, req.params.id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ error: 'Not found' });

    const [rows] = await pool.query(
      'SELECT account_id, username, email, role FROM Account WHERE account_id=?',
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
    const allowed = ['username', 'password', 'email', 'role'];
    const fields = [];
    const values = [];

    for (const k of allowed) {
      if (req.body[k] !== undefined) {
        if (k === 'password') {
          const hashed = await bcrypt.hash(req.body[k], 10);
          fields.push('password = ?');
          values.push(hashed);
        } else {
          fields.push(`${k} = ?`);
          values.push(req.body[k]);
        }
      }
    }

    if (!fields.length)
      return res.status(400).json({ error: 'ไม่มีฟิลด์ให้อัปเดต' });

    values.push(req.params.id);

    const [result] = await pool.query(
      `UPDATE Account SET ${fields.join(', ')} WHERE account_id = ?`,
      values
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ error: 'Not found' });

    const [rows] = await pool.query(
      'SELECT account_id, username, email, role FROM Account WHERE account_id=?',
      [req.params.id]
    );
    res.json(rows[0]);
  } catch (e) {
    console.error('Patch account error:', e);
    res.status(500).json({ error: e.code || 'DB error', message: e.sqlMessage });
  }
});

// -----------------------------------------------------------------------------
// ✅ DELETE /account/:id — ลบบัญชีและข้อมูลที่เกี่ยวข้อง
// -----------------------------------------------------------------------------
router.delete('/:id', async (req, res) => {
  const accountId = req.params.id;
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    await conn.query('DELETE FROM Member WHERE account_id = ?', [accountId]);
    await conn.query(
      `DELETE c FROM Course c
       JOIN Trainer t ON c.trainer_id = t.trainer_id
       WHERE t.account_id = ?`,
      [accountId]
    );
    await conn.query('DELETE FROM Trainer WHERE account_id = ?', [accountId]);

    const [result] = await conn.query(
      'DELETE FROM Account WHERE account_id = ?',
      [accountId]
    );

    if (result.affectedRows === 0) {
      await conn.rollback();
      return res.status(404).json({ error: 'Not found' });
    }

    await conn.commit();
    res.json({ deleted: true, id: Number(accountId) });
  } catch (e) {
    await conn.rollback();
    console.error('Delete account error:', e);
    if (e.code === 'ER_ROW_IS_REFERENCED_2' || e.errno === 1451) {
      return res.status(409).json({
        error: 'FK_CONFLICT',
        message: 'ลบไม่ได้เพราะมีข้อมูลอื่นอ้างถึงบัญชีนี้',
      });
    }
    res.status(500).json({ error: e.code || 'DB error', message: e.sqlMessage });
  } finally {
    conn.release();
  }
});

// -----------------------------------------------------------------------------
// ✅ GET /account/profile/:account_id — ข้อมูลโปรไฟล์ผู้ใช้ (Account + Member)
// -----------------------------------------------------------------------------
router.get('/profile/:account_id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
         a.account_id,
         a.username,
         a.role,
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
