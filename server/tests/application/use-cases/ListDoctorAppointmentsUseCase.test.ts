import { describe, it, expect, vi } from 'vitest';
import { ListDoctorAppointmentsUseCase } from '../../../src/application/use-cases/doctor/ListDoctorAppointmentsUseCase';
import { IAppointmentRepository } from '../../../src/domain/repositories/IAppointmentRepository';

describe('ListDoctorAppointmentsUseCase', () => {
  const mockAppointmentRepo: IAppointmentRepository = {
    findById: vi.fn(),
    findByPatientId: vi.fn(),
    findByDoctorIdAndDate: vi.fn(),
    findPendingByPatientAndDepartment: vi.fn(),
    create: vi.fn(),
    updateStatus: vi.fn(),
  };

  const useCase = new ListDoctorAppointmentsUseCase(mockAppointmentRepo);

  it('should return appointments for the doctor on a date', async () => {
    vi.mocked(mockAppointmentRepo.findByDoctorIdAndDate).mockResolvedValue([
      { id: 1, patientId: 1, doctorId: 1, status: 'PENDING' as any, hour: 9, getDateString: () => '2026-06-01' },
    ] as any);

    const result = await useCase.execute(1, new Date('2026-06-01'));

    expect(result.length).toBe(1);
  });
});
