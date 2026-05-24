import { IAppointmentRepository } from '../../../domain/repositories/IAppointmentRepository';
import { IDoctorRepository } from '../../../domain/repositories/IDoctorRepository';
import { IDepartmentRepository } from '../../../domain/repositories/IDepartmentRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { AppointmentResponse } from '../../dtos/appointment.dto';

export class UpdateAppointmentStatusUseCase {
  constructor(
    private readonly appointmentRepo: IAppointmentRepository,
    private readonly doctorRepo: IDoctorRepository,
    private readonly deptRepo: IDepartmentRepository,
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(doctorId: number, appointmentId: number, status: 'VISITED' | 'NO_SHOW'): Promise<AppointmentResponse> {
    const appointment = await this.appointmentRepo.findById(appointmentId);
    if (!appointment) {
      throw new Error('预约不存在');
    }

    if (appointment.doctorId !== doctorId) {
      throw new Error('无权操作其他医生的预约');
    }

    if (status === 'VISITED') {
      appointment.markVisited();
    } else {
      appointment.markNoShow();
    }

    const saved = await this.appointmentRepo.updateStatus(appointmentId, appointment.status);

    const patient = await this.userRepo.findById(saved.patientId);
    const dept = await this.deptRepo.findById(saved.departmentId);

    return {
      id: saved.id!,
      patientId: saved.patientId,
      patientName: patient?.name || '',
      doctorId: saved.doctorId,
      doctorName: '',
      departmentId: saved.departmentId,
      departmentName: dept?.name || '',
      date: saved.getDateString(),
      hour: saved.hour,
      status: saved.status,
      symptom: saved.symptom,
      diagnosis: saved.diagnosis,
      createdAt: '',
    };
  }
}
