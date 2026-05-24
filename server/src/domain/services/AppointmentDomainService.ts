import { IScheduleRepository } from '../repositories/IScheduleRepository';
import { IAppointmentRepository } from '../repositories/IAppointmentRepository';
import { AppointmentStatus } from '../enums';

interface ValidationResult {
  allowed: boolean;
  reason?: string;
}

export class AppointmentDomainService {
  constructor(
    private readonly scheduleRepo: IScheduleRepository,
    private readonly appointmentRepo: IAppointmentRepository,
  ) {}

  async canCreateAppointment(
    patientId: number,
    doctorId: number,
    departmentId: number,
    date: Date,
    hour: number,
  ): Promise<ValidationResult> {
    const schedules = await this.scheduleRepo.findByDoctorIdAndDate(doctorId, date);
    const hasSlot = schedules.some((s) => s.hour === hour);

    if (!hasSlot) {
      return { allowed: false, reason: '该时段不可预约' };
    }

    const existing = await this.appointmentRepo.findPendingByPatientAndDepartment(
      patientId,
      departmentId,
      date,
    );

    if (existing.length > 0) {
      return { allowed: false, reason: '该科室当天已有预约，请先取消' };
    }

    return { allowed: true };
  }

  canCancelAppointment(
    status: AppointmentStatus,
    patientId: number,
    requestPatientId: number,
  ): ValidationResult {
    if (patientId !== requestPatientId) {
      return { allowed: false, reason: '无权取消他人预约' };
    }

    if (status !== AppointmentStatus.PENDING) {
      const label: Record<string, string> = {
        VISITED: '已就诊',
        NO_SHOW: '未到',
        CANCELLED: '已取消',
      };
      return { allowed: false, reason: `该预约已${label[status] || status}，不可取消` };
    }

    return { allowed: true };
  }
}
