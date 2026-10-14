import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import musicRoutes from './routes/music.routes.js';
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());


app.use('/api/auth', authRoutes);
app.use('/api/music', musicRoutes);

export default app;