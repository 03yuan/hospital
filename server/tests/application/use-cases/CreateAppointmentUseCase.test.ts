import { describe, it, expect, vi } from 'vitest';
import { CreateAppointmentUseCase } from '../../../src/application/use-cases/patient/CreateAppointmentUseCase';
import { IAppointmentRepository } from '../../../src/domain/repositories/IAppointmentRepository';
import { IScheduleRepository } from '../../../src/domain/repositories/IScheduleRepository';
import { IDoctorRepository } from '../../../src/domain/repositories/IDoctorRepository';
import { IDepartmentRepository } from '../../../src/domain/repositories/IDepartmentRepository';
import { AppointmentDomainService } from '../../../src/domain/services/AppointmentDomainService';

describe('CreateAppointmentUseCase', () => {
  const mockAppointmentRepo: IAppointmentRepository = {
    findById: vi.fn(),
    findByPatientId: vi.fn(),
    findByDoctorIdAndDate: vi.fn(),
    findPendingByPatientAndDepartment: vi.fn(),
    create: vi.fn(),
    updateStatus: vi.fn(),
  };

  const mockScheduleRepo: IScheduleRepository = {
    findById: vi.fn(),
    findByDoctorIdAndDate: vi.fn(),
    findByDoctorIdAndMonth: vi.fn(),
    create: vi.fn(),
    createMany: vi.fn(),
    delete: vi.fn(),
  };

  const mockDoctorRepo: IDoctorRepository = {
    findAll: vi.fn(),
    findById: vi.fn(),
    findByDepartmentId: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    updateStatus: vi.fn(),
  };

  const mockDeptRepo: IDepartmentRepository = {
    findAll: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    updateStatus: vi.fn(),
  };

  const domainService = new AppointmentDomainService(mockScheduleRepo, mockAppointmentRepo);
  const useCase = new CreateAppointmentUseCase(
    mockAppointmentRepo, mockScheduleRepo, mockDoctorRepo, mockDeptRepo, domainService,
  );

  it('should create appointment when rules pass', async () => {
    vi.mocked(mockScheduleRepo.findById).mockResolvedValue({
      id: 1, doctorId: 1, hour: 9, date: new Date('2026-06-01'), getDateString: () => '2026-06-01', getTimeLabel: () => '09:00-10:00',
    });
    vi.mocked(mockAppointmentRepo.findPendingByPatientAndDepartment).mockResolvedValue([]);
    vi.mocked(mockDoctorRepo.findById).mockResolvedValue({
      id: 1, userId: 1, departmentId: 1, title: '主任医师', description: '',
      updateDepartment: vi.fn(), updateTitle: vi.fn(),
    });
    vi.mocked(mockDeptRepo.findById).mockResolvedValue({
      id: 1, name: '内科', description: '', status: 'ACTIVE' as any,
      activate: vi.fn(), deactivate: vi.fn(), update: vi.fn(),
    });
    vi.mocked(mockAppointmentRepo.create).mockResolvedValue({
      id: 10, patientId: 1, doctorId: 1, departmentId: 1, scheduleId: 1,
      date: new Date('2026-06-01'), hour: 9, status: 'PENDING' as any,
      getDateString: () => '2026-06-01', canCancel: () => true,
      cancel: vi.fn(), markVisited: vi.fn(), markNoShow: vi.fn(),
    });

    const result = await useCase.execute(1, { doctorId: 1, scheduleId: 1, date: '2026-06-01', hour: 9 });

    expect(result.status).toBe('PENDING');
  });

  it('should reject when schedule does not exist', async () => {
    vi.mocked(mockScheduleRepo.findById).mockResolvedValue(null);

    await expect(
      useCase.execute(1, { doctorId: 1, scheduleId: 999, date: '2026-06-01', hour: 9 }),
    ).rejects.toThrow('不可预约');
  });
});
