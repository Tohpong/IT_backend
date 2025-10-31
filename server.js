import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import memberRouter from './routes/member_routes.js';
import accountRouter from './routes/account_routes.js';
import courseRouter from './routes/course_routes.js';
import trainerRouter from './routes/trainer_routes.js';
import enrollRoutes from './routes/enroll_routes.js';


const app = express();
app.use(cors());
app.use(express.json());
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use('/member', memberRouter);        // → http://localhost:8000/member
app.use('/account', accountRouter);    // → http://localhost:8000/account
app.use('/course', courseRouter);      // → http://localhost:8000/course
app.use('/trainer', trainerRouter);    // → http://localhost:8000/trainer
app.use('/enroll', enrollRoutes);      // → http://localhost:8000/enroll
// ✅ ให้ express เปิดโฟลเดอร์ uploads แบบสาธารณะ
//app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req,res)=>res.send('OK'));
app.use((req,res)=>res.status(404).json({ error:'Not Found', path:req.path }));


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`API on http://localhost:${PORT}`);
});







