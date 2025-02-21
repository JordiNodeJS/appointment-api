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
exports.AppointmentController = void 0;
const appointmentService_1 = require("../services/appointmentService");
class AppointmentController {
    constructor() {
        this.getTransformedAppointments = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { appointmentIds } = req.body;
                if (!appointmentIds || !Array.isArray(appointmentIds)) {
                    return res.status(400).json({ error: 'appointmentIds array is required' });
                }
                const appointments = yield this.appointmentService.getAppointmentsByIds(appointmentIds);
                const transformedAppointments = this.appointmentService.transformAppointments(appointments);
                return res.json(transformedAppointments);
            }
            catch (error) {
                return res.status(500).json({ error: 'Internal server error' });
            }
        });
        this.getAppointmentsByIds = (appointmentIds) => __awaiter(this, void 0, void 0, function* () {
            return this.appointmentService.getAppointmentsByIds(appointmentIds);
        });
        this.appointmentService = new appointmentService_1.AppointmentService();
    }
}
exports.AppointmentController = AppointmentController;
