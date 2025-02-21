"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentService = void 0;
const database_1 = require("../config/database");
class AppointmentService {
    getAppointmentsByIds(appointmentIds) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const [rows] = yield database_1.pool.execute(query, appointmentIds);
            return rows;
        });
    }
    transformAppointments(appointments) {
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
exports.AppointmentService = AppointmentService;
