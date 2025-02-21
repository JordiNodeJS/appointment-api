import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppointmentService } from './services/appointmentService';
import { pool } from './config/database';
import appointmentRoutes from './routes/appointmentRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api/appointments', appointmentRoutes);

const appointmentService = new AppointmentService();

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

interface BatchAppointmentRequest {
    appointmentIds: string[];
}

app.post('/appointments', async (req: Request, res: Response) => {
    try {
        const { appointmentIds } = req.body as BatchAppointmentRequest;
        
        if (!Array.isArray(appointmentIds)) {
            return res.status(400).json({ error: 'appointmentIds must be an array' });
        }

        if (appointmentIds.length === 0) {
            return res.status(400).json({ error: 'appointmentIds cannot be empty' });
        }

        const appointments = await appointmentService.getAppointmentsByIds(appointmentIds);
        res.json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

export default app;