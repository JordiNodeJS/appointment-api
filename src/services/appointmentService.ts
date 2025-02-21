import { pool } from '../config/database';
import { Appointment, TransformedAppointment } from '../types/appointment';

export class AppointmentService {
    async getAppointmentsByIds(appointmentIds: string[]): Promise<Appointment[]> {
        const placeholders = appointmentIds.map(() => 'UUID_TO_BIN(?)').join(',');
        
        const query = `
            SELECT 
                BIN_TO_UUID(a.id_optic) as idOptic,
                op.name as opticName,
                BIN_TO_UUID(a.id) as appointmentId,
                a.appointment_date as appointmentDate,
                UNIX_TIMESTAMP(a.appointment_date) as appointmentDateUnix,
                c.first_name as firstName,
                BIN_TO_UUID(c.id) as idCustomer,
                c.phone_number as phoneNumber
            FROM test.appointment a
            INNER JOIN test.customer c ON a.id_customer = c.id
            INNER JOIN test.optic op ON a.id_optic = op.id
            WHERE a.id IN (${placeholders})
        `;

        const [rows] = await pool.execute(query, appointmentIds);
        return rows as Appointment[];
    }

    transformAppointments(appointments: Appointment[]): TransformedAppointment[] {
        return appointments.map(appointment => ({
            agent_id: 182,
            input: {
                instructions: {
                    languageForCall: "spanish",
                    idOptic: appointment.idOptic,
                    opticName: appointment.opticName,
                    appointmendId: appointment.appointmentId,
                    appointmentDate: appointment.appointmentDateUnix * 1000, // Convert to milliseconds
                    firstName: appointment.firstName,
                    idCustomer: appointment.idCustomer,
                    phoneNumber: appointment.phoneNumber,
                    utms: {
                        s: "source",
                        utm_source: "nforce",
                        utm_campaign: "utm_campaign",
                        utm_content: "utm_content",
                        utm_adgroup: "utm_adgroup",
                        needs_financing: 0
                    }
                }
            },
            metadata: {}
        }));
    }
}