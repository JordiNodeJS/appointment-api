import { Router, Request, Response } from 'express';
import { AppointmentController } from '../controllers/appointmentController';

const router = Router();
const appointmentController = new AppointmentController();

interface BatchAppointmentRequest {
    appointmentIds: string[];
}

router.post('/transformed', (req: Request, res: Response): void => {
    void appointmentController.getTransformedAppointments(req, res);
});

router.post('/', (req: Request, res: Response): void => {
    void (async () => {
        try {
            const { appointmentIds } = req.body as BatchAppointmentRequest;
            
            if (!Array.isArray(appointmentIds)) {
                res.status(400).json({ error: 'appointmentIds must be an array' });
                return;
            }
            if (appointmentIds.length === 0) {
                res.status(400).json({ error: 'appointmentIds cannot be empty' });
                return;
            }

            const appointments = await appointmentController.getAppointmentsByIds(appointmentIds);
            res.json(appointments);
        } catch (error) {
            console.error('Error fetching appointments:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    })();
});

export default router;
