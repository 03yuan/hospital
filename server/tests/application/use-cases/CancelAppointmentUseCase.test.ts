import { describe, it, expect, vi } from 'vitest';
import { CancelAppointmentUseCase } from '../../../src/application/use-cases/patient/CancelAppointmentUseCase';
import { IAppointmentRepository } from '../../../src/domain/repositories/IAppointmentRepository';

describe('CancelAppointmentUseCase', () => {
  const mockAppointmentRepo: IAppointmentRepository = {
    findById: vi.fn(),
    findByPatientId: vi.fn(),
    findByDoctorIdAndDate: vi.fn(),
    findPendingByPatientAndDepartment: vi.fn(),
    create: vi.fn(),
    updateStatus: vi.fn(),
  };

  const useCase = new CancelAppointmentUseCase(mockAppointmentRepo);

  it('should cancel a PENDING appointment', async () => {
    const mockApt = {
      id: 1, patientId: 1, doctorId: 1, departmentId: 1, scheduleId: 1,
      date: new Date('2026-06-01'), hour: 9, status: 'PENDING' as any,
      canCancel: () => true, cancel: vi.fn(),
      getDateString: () => '2026-06-01',
      markVisited: vi.fn(), markNoShow: vi.fn(),
    };
    vi.mocked(mockAppointmentRepo.findById).mockResolvedValue(mockApt);
    vi.mocked(mockAppointmentRepo.updateStatus).mockResolvedValue({ ...mockApt, status: 'CANCELLED' as any });

    const result = await useCase.execute(1, 1);

    expect(result.status).toBe('CANCELLED');
  });

  it('should reject cancelling another patient appointment', async () => {
    vi.mocked(mockAppointmentRepo.findById).mockResolvedValue({
      id: 1, patientId: 2, canCancel: () => true,
    } as any);

    await expect(useCase.execute(1, 1)).rejects.toThrow('无权取消');
  });

  it('should reject cancelling non-PENDING appointment', async () => {
    vi.mocked(mockAppointmentRepo.findById).mockResolvedValue({
      id: 1, patientId: 1, status: 'VISITED' as any, canCancel: () => false,
    } as any);

    await expect(useCase.execute(1, 1)).rejects.toThrow('不可取消');
  });
});
