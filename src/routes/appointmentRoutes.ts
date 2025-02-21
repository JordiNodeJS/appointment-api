import { Router, Request, Response } from 'express';
import { AppointmentController } from '../controllers/appointmentController';
import { NforceController } from '../controllers/nforceController';
import { FakeNforceController } from '../controllers/fakeNforceController';

const router = Router();
const appointmentController = new AppointmentController();
const nforceController = new NforceController();
const fakeNforceController = new FakeNforceController();

interface BatchAppointmentRequest {
    appointmentIds: string[];
}

router.post('/transformed', (req: Request, res: Response): void => {
    void appointmentController.getTransformedAppointments(req, res);
});

router.post('/nforce', (req: Request, res: Response): void => {
    void nforceController.processNforceData(req, res);
});

router.post('/fake-nforce', (req: Request, res: Response): void => {
    void fakeNforceController.processNforceData(req, res);
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
