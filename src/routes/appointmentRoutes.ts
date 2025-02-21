import { Router } from 'express';
import { AppointmentController } from '../controllers/appointmentController';

const router = Router();
const appointmentController = new AppointmentController();

router.post('/transformed', appointmentController.getTransformedAppointments);

export default router;
