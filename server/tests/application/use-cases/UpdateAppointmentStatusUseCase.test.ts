import { describe, it, expect, vi } from 'vitest';
import { UpdateAppointmentStatusUseCase } from '../../../src/application/use-cases/doctor/UpdateAppointmentStatusUseCase';
import { IAppointmentRepository } from '../../../src/domain/repositories/IAppointmentRepository';

describe('UpdateAppointmentStatusUseCase', () => {
  const mockAppointmentRepo: IAppointmentRepository = {
    findById: vi.fn(),
    findByPatientId: vi.fn(),
    findByDoctorIdAndDate: vi.fn(),
    findPendingByPatientAndDepartment: vi.fn(),
    create: vi.fn(),
    updateStatus: vi.fn(),
  };

  const useCase = new UpdateAppointmentStatusUseCase(mockAppointmentRepo);

  it('should mark as VISITED when doctor owns the appointment', async () => {
    vi.mocked(mockAppointmentRepo.findById).mockResolvedValue({
      id: 1, doctorId: 1, status: 'PENDING' as any,
      markVisited: vi.fn(), markNoShow: vi.fn(),
    } as any);
    vi.mocked(mockAppointmentRepo.updateStatus).mockResolvedValue({ id: 1, status: 'VISITED' as any } as any);

    const result = await useCase.execute(1, 1, 'VISITED');

    expect(result.status).toBe('VISITED');
  });

  it('should reject when doctor does not own the appointment', async () => {
    vi.mocked(mockAppointmentRepo.findById).mockResolvedValue({
      id: 1, doctorId: 2,
    } as any);

    await expect(useCase.execute(1, 1, 'VISITED')).rejects.toThrow('无权操作');
  });
});
