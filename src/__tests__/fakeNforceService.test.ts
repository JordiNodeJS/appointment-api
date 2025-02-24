import { FakeNforceService } from '../services/fakeNforceService';

describe('FakeNforceService', () => {
    let fakeNforceService: FakeNforceService;

    beforeEach(() => {
        fakeNforceService = new FakeNforceService();
    });

    describe('processAppointments', () => {
        it('should process valid appointments successfully', async () => {
            const mockAppointments = [{
                input: {
                    instructions: {
                        appointmendId: '123',
                        opticName: 'Test Optic',
                        idOptic: '456',
                        firstName: 'John',
                        phoneNumber: '1234567890',
                        appointmentDate: Date.now(),
                        idCustomer: '789'
                    }
                }
            }];

            const results = await fakeNforceService.processAppointments(mockAppointments);
            
            expect(results).toHaveLength(1);
            expect(results[0].success).toBe(true);
            expect(results[0].data.id).toBe('fake-123');
            expect(results[0].data.status).toBe('completed');
            expect(results[0].data.input).toEqual(mockAppointments[0].input);
        });

        it('should handle invalid appointments', async () => {
            const invalidAppointments = [
                { input: { instructions: {} } },
                null,
                undefined,
                { wrongStructure: true }
            ];

            const results = await fakeNforceService.processAppointments(invalidAppointments);
            
            expect(results).toHaveLength(4);
            results.forEach(result => {
                expect(result.error).toBeDefined();
            });
        });

        it('should reject non-array input', async () => {
            await expect(fakeNforceService.processAppointments({} as any))
                .rejects
                .toThrow('Appointments must be an array');
        });
    });
});