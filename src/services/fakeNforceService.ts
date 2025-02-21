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

export class FakeNforceService {
    private readonly apiUrl = 'https://fake-nforce.ai/api/threads/runs';
    private readonly token = 'fake_token';
    private readonly agentId = 999;
    private readonly DELAY_BETWEEN_REQUESTS = 0; // No delay for fake service

    async processAppointments(appointments: any[]): Promise<any[]> {
        if (!Array.isArray(appointments)) {
            console.error('Invalid appointments input:', appointments);
            throw new Error('Appointments must be an array');
        }

        const results = [];
        
        for (const appointment of appointments) {
            try {
                if (!appointment || !appointment.input?.instructions?.appointmendId) {
                    console.warn('Skipping invalid appointment:', appointment?.input?.instructions?.opticName);
                    results.push({ error: 'Invalid appointment data', appointment });
                    continue;
                }

                const response = await this.makeRequest(appointment);
                results.push(response);
            } catch (error) {
                console.error(`Error processing appointment:`, error);
                results.push({ 
                    error: error instanceof Error ? error.message : 'Unknown error',
                    appointmentId: appointment?.input?.instructions?.appointmendId
                });
            }
        }
        
        return results;
    }

    private async makeRequest(appointment: any): Promise<any> {
        if (!appointment?.input || !appointment?.input.instructions?.appointmendId) {
            throw new Error('Invalid appointment data structure');
        }

        // Create a response that mirrors the input data with additional mock metadata
        return {
            success: true,
            data: {
                id: `fake-${appointment.input.instructions.appointmendId}`,
                status: 'completed',
                input: appointment.input,
                created_at: new Date().toISOString(),
                completed_at: new Date().toISOString()
            }
        };
    }
}