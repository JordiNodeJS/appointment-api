interface NforceInput {
    instructions: {
        languageForCall: string;
        idOptic: string;
        opticName: string;
        appointmendId: string;
        appointmentDate: number;
        firstName: string;
        idCustomer: string;
        phoneNumber: string;
        utms: {
            s: string;
            utm_source: string;
            utm_campaign: string;
            utm_content: string;
            utm_adgroup: string;
            needs_financing: number;
        };
    };
}

interface NforcePayload {
    agent_id: number;
    input: {
        instructions: NforceInput['instructions'];
    };
    metadata: Record<string, any>;
}

export class NforceService {
    private readonly apiUrl: string;
    private readonly token: string;
    private readonly agentId: number;
    private readonly DELAY_BETWEEN_REQUESTS: number;

    constructor() {
        if (!process.env.NFORCE_API_URL) throw new Error('NFORCE_API_URL is required');
        if (!process.env.NFORCE_TOKEN) throw new Error('NFORCE_TOKEN is required');
        if (!process.env.NFORCE_AGENT_ID) throw new Error('NFORCE_AGENT_ID is required');
        
        this.apiUrl = process.env.NFORCE_API_URL;
        this.token = process.env.NFORCE_TOKEN;
        this.agentId = Number(process.env.NFORCE_AGENT_ID);
        this.DELAY_BETWEEN_REQUESTS = Number(process.env.NFORCE_DELAY_BETWEEN_REQUESTS || 60000);
    }

    async processAppointments(appointments: any[]): Promise<any[]> {
        if (!Array.isArray(appointments)) {
            console.error('Invalid appointments input:', appointments);
            throw new Error('Appointments must be an array');
        }

        const results = [];
        
        for (let i = 0; i < appointments.length; i++) {
            const appointment = appointments[i];
            console.log('Processing appointment:', appointment.input.instructions.opticName);
            
            try {
                // Agregar delay antes de procesar cada appointment (excepto el primero)
                if (i > 0) {
                    console.log(`Waiting ${this.DELAY_BETWEEN_REQUESTS/1000} seconds before next request...`);
                    await new Promise(resolve => setTimeout(resolve, this.DELAY_BETWEEN_REQUESTS));
                }

                if (!appointment || !appointment.input.instructions.appointmendId) {
                    console.warn('Skipping invalid appointment:', appointment.input.instructions.opticName);
                    results.push({ error: 'Invalid appointment data', appointment });
                    continue;
                }

                const response = await this.makeRequest(appointment);
                results.push(response || { error: 'No response received' });
            } catch (error) {
                console.error(`Error processing appointment:`, error);
                results.push({ 
                    error: error instanceof Error ? error.message : 'Unknown error',
                    appointmentId: appointment?.id
                });
            }
        }
        
        return results;
    }

    private async makeRequest(appointment: any): Promise<any> {

        // console.log('Making request to nforce with appointment:', appointment);
        debugger;
        try {
            console.log('Processing appointment from makeRequest:', appointment.input.instructions.opticName);
            
            if (!appointment?.input || !appointment?.input.instructions?.appointmendId) {
                throw new Error('Invalid appointment data structure');
            }

            const payload: NforcePayload = {
                agent_id: this.agentId,
                input: {
                    instructions: {
                        languageForCall: "spanish",
                        idOptic: appointment.input.instructions.idOptic,
                        opticName: appointment.input.instructions.opticName || 'Unknown',
                        appointmendId: appointment.input.instructions.appointmendId,
                        appointmentDate: Number(appointment.input.instructions.appointmentDate) || Date.now(),
                        firstName: String(appointment.input.instructions.firstName || '').trim(),
                        idCustomer: appointment.input.instructions.idCustomer || appointment.input.instructions.appointmendId,
                        phoneNumber: String(appointment.input.instructions.phoneNumber || '').trim(),
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
            };

            console.log('Sending payload to nforce:', payload);

            try {
                const response = await fetch(this.apiUrl, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Nforce API error:', {
                        status: response.status,
                        statusText: response.statusText,
                        body: errorText
                    });
                    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
                }

                return await response.json();
            } catch (error) {
                console.error('Error making request to nforce:', error);
                throw error;
            }
        } catch (error) {
            console.error('Error in makeRequest:', error);
            throw error;
        }
    }
}