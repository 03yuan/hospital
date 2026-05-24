import { describe, it, expect, vi } from 'vitest';
import { ListPatientAppointmentsUseCase } from '../../../src/application/use-cases/patient/ListPatientAppointmentsUseCase';
import { IAppointmentRepository } from '../../../src/domain/repositories/IAppointmentRepository';

describe('ListPatientAppointmentsUseCase', () => {
  const mockAppointmentRepo: IAppointmentRepository = {
    findById: vi.fn(),
    findByPatientId: vi.fn(),
    findByDoctorIdAndDate: vi.fn(),
    findPendingByPatientAndDepartment: vi.fn(),
    create: vi.fn(),
    updateStatus: vi.fn(),
  };

  const useCase = new ListPatientAppointmentsUseCase(mockAppointmentRepo);

  it('should return appointments for the patient', async () => {
    vi.mocked(mockAppointmentRepo.findByPatientId).mockResolvedValue([
      { id: 1, patientId: 1, doctorId: 1, departmentId: 1, status: 'PENDING' as any, hour: 9, getDateString: () => '2026-06-01' },
    ] as any);

    const result = await useCase.execute(1);

    expect(result.length).toBe(1);
  });
});
