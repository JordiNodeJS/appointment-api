import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './config/database';
import appointmentRoutes from './routes/appointmentRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/appointments', appointmentRoutes);

// Health check route
app.get('/health', async (req: Request, res: Response) => {
    try {
        // Test database connection
        await pool.query('SELECT 1');
        res.json({ status: 'healthy', database: 'connected' });
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(503).json({ status: 'unhealthy', database: 'disconnected' });
    }
});

// Basic test route
app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'API is running' });
});

export default app;