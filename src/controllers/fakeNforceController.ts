import { Request, Response } from 'express';
import { FakeNforceService } from '../services/fakeNforceService';
import { AppointmentController } from './appointmentController';

export class FakeNforceController {
    private nforceService: FakeNforceService;
    private appointmentController: AppointmentController;

    constructor() {
        this.nforceService = new FakeNforceService();
        this.appointmentController = new AppointmentController();
    }

    async processNforceData(req: Request, res: Response): Promise<void> {
        try {
            const { appointmentIds } = req.body;
            
            if (!Array.isArray(appointmentIds) || !appointmentIds.length) {
                res.status(400).json({ error: 'Valid appointmentIds array is required' });
                return;
            }

            let transformedAppointments;
            try {
                transformedAppointments = await this.appointmentController.getTransofrmedAppointmentsNforce(appointmentIds);
                if (!transformedAppointments) {
                    throw new Error('Transformation failed - no data returned');
                }
            } catch (error) {
                console.error('Appointment transformation error:', error);
                res.status(422).json({ 
                    success: false,
                    error: 'Failed to transform appointments',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
                return;
            }

            if (!transformedAppointments.length) {
                res.status(404).json({ 
                    success: false,
                    error: 'No appointments found or transformation failed'
                });
                return;
            }

            console.log('Valid appointments after transformation:', transformedAppointments.length);
            if (!transformedAppointments.length) {
                res.status(422).json({
                    success: false,
                    error: 'No valid appointments after transformation'
                });
                return;
            }

            console.log('Processing valid appointments:', transformedAppointments.length);
            const results = await this.nforceService.processAppointments(transformedAppointments);
            
            res.status(200).json({ 
                success: true,
                processed: transformedAppointments.length,
                total: appointmentIds.length,
                data: results 
            });
        } catch (error) {
            console.error('Error in processNforceData:', error);
            res.status(500).json({ 
                success: false,
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
}