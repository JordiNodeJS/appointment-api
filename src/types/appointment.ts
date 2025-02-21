export interface Appointment {
    idOptic: string;
    opticName: string;
    appointmentId: string;
    appointmentDate: Date;
    appointmentDateUnix: number;
    firstName: string;
    idCustomer: string;
    phoneNumber: string;
}

export interface UtmParams {
    s: string;
    utm_source: string;
    utm_campaign: string;
    utm_content: string;
    utm_adgroup: string;
    needs_financing: number;
}

export interface TransformedAppointment {
    agent_id: number;
    input: {
        instructions: {
            languageForCall: string;
            idOptic: string;
            opticName: string;
            appointmendId: string;
            appointmentDate: number;
            firstName: string;
            idCustomer: string;
            phoneNumber: string;
            utms: UtmParams;
        };
    };
    metadata: Record<string, unknown>;
}