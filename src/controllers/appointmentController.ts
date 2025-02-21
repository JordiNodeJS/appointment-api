import { Request, Response } from 'express';
import { AppointmentService } from '../services/appointmentService';

export class AppointmentController {
    private appointmentService: AppointmentService;

    constructor() {
        this.appointmentService = new AppointmentService();
    }

    getTransformedAppointments = async (req: Request, res: Response) => {
        try {
            const { appointmentIds } = req.body;
            
            if (!appointmentIds || !Array.isArray(appointmentIds)) {
                return res.status(400).json({ error: 'appointmentIds array is required' });
            }

            const appointments = await this.appointmentService.getAppointmentsByIds(appointmentIds);
            const transformedAppointments = this.appointmentService.transformAppointments(appointments);
            
            return res.json(transformedAppointments);
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    getAppointmentsByIds = async (appointmentIds: string[]) => {
        return this.appointmentService.getAppointmentsByIds(appointmentIds);
    }
}
