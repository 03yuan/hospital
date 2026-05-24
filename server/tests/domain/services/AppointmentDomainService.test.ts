import { describe, it, expect, vi } from 'vitest';
import { AppointmentDomainService } from '../../../src/domain/services/AppointmentDomainService';
import { AppointmentStatus } from '../../../src/domain/enums';

describe('AppointmentDomainService', () => {
  const mockScheduleRepo = {
    findByDoctorIdAndDate: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    createMany: vi.fn(),
    delete: vi.fn(),
  };

  const mockAppointmentRepo = {
    findById: vi.fn(),
    findByPatientId: vi.fn(),
    findByDoctorIdAndDate: vi.fn(),
    create: vi.fn(),
    updateStatus: vi.fn(),
    findPendingByPatientAndDepartment: vi.fn(),
  };

  const service = new AppointmentDomainService(mockScheduleRepo, mockAppointmentRepo);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('canCreateAppointment', () => {
    it('should return success when schedule exists and no conflict', async () => {
      mockScheduleRepo.findByDoctorIdAndDate.mockResolvedValue([{ id: 1, doctorId: 1, hour: 9 }]);
      mockAppointmentRepo.findPendingByPatientAndDepartment.mockResolvedValue([]);

      const result = await service.canCreateAppointment(1, 1, 1, new Date('2026-06-01'), 9);

      expect(result.allowed).toBe(true);
      expect(result.reason).toBeUndefined();
    });

    it('should return failure when schedule does not exist', async () => {
      mockScheduleRepo.findByDoctorIdAndDate.mockResolvedValue([]);

      const result = await service.canCreateAppointment(1, 1, 1, new Date('2026-06-01'), 9);

      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('不可预约');
    });

    it('should return failure when same department same day conflict exists', async () => {
      mockScheduleRepo.findByDoctorIdAndDate.mockResolvedValue([{ id: 1, doctorId: 1, hour: 9 }]);
      mockAppointmentRepo.findPendingByPatientAndDepartment.mockResolvedValue([
        { id: 99, status: AppointmentStatus.PENDING },
      ]);

      const result = await service.canCreateAppointment(1, 1, 1, new Date('2026-06-01'), 9);

      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('已有预约');
    });

    it('should allow appointment in different department on same day', async () => {
      mockScheduleRepo.findByDoctorIdAndDate.mockResolvedValue([{ id: 1, doctorId: 2, hour: 14 }]);
      mockAppointmentRepo.findPendingByPatientAndDepartment.mockResolvedValue([]);

      const result = await service.canCreateAppointment(1, 2, 2, new Date('2026-06-01'), 14);

      expect(result.allowed).toBe(true);
    });
  });

  describe('canCancelAppointment', () => {
    it('should return true for PENDING appointment owned by the patient', () => {
      const result = service.canCancelAppointment(AppointmentStatus.PENDING, 1, 1);
      expect(result.allowed).toBe(true);
    });

    it('should return false for VISITED appointment', () => {
      const result = service.canCancelAppointment(AppointmentStatus.VISITED, 1, 1);
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('已就诊');
    });

    it('should return false when patient does not own the appointment', () => {
      const result = service.canCancelAppointment(AppointmentStatus.PENDING, 1, 2);
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('无权');
    });
  });
});
