import { pool } from '../config/database';
import { Appointment } from '../types/appointment';

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
}