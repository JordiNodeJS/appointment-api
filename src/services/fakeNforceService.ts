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
    private readonly DELAY_BETWEEN_REQUESTS = 10000; // 10 seconds delay for demo purposes

    async processAppointments(appointments: any[]): Promise<any[]> {
        if (!Array.isArray(appointments)) {
            console.error('Invalid appointments input:', appointments);
            throw new Error('Appointments must be an array');
        }

        const totalRequests = appointments.length;
        const results = [];
        
        console.log(`\n=== Starting Fake NForce Process ===`);
        console.log(`Total calls to make: ${totalRequests}`);
        
        for (let i = 0; i < appointments.length; i++) {
            const appointment = appointments[i];
            const remainingCalls = totalRequests - i;
            
            console.log(`\n=== Request ${i + 1}/${totalRequests} ===`);
            console.log(`Remaining calls: ${remainingCalls - 1}`);
            console.log('Processing appointment:', appointment.input.instructions.opticName, 'customer:', appointment.input.instructions.firstName, 'appointmendId:', appointment.input.instructions.appointmendId);


            
            try {
                if (i > 0) {
                    await this.countdownTimer(this.DELAY_BETWEEN_REQUESTS);
                }

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
        
        console.log('\n=== Process Completed ===');
        return results;
    }

    private async countdownTimer(delay: number): Promise<void> {
        const seconds = Math.floor(delay / 1000);
        console.log(`\nStarting countdown for next fake call...`);
        
        for (let i = seconds; i > 0; i--) {
            process.stdout.write(`\rTime until next call: ${i} seconds`);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        console.log('\n');
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