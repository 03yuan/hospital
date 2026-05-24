import { IAppointmentRepository } from '../../../domain/repositories/IAppointmentRepository';
import { IDoctorRepository } from '../../../domain/repositories/IDoctorRepository';
import { IDepartmentRepository } from '../../../domain/repositories/IDepartmentRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { AppointmentResponse } from '../../dtos/appointment.dto';

export class CancelAppointmentUseCase {
  constructor(
    private readonly appointmentRepo: IAppointmentRepository,
    private readonly doctorRepo: IDoctorRepository,
    private readonly deptRepo: IDepartmentRepository,
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(patientId: number, appointmentId: number): Promise<AppointmentResponse> {
    const appointment = await this.appointmentRepo.findById(appointmentId);
    if (!appointment) {
      throw new Error('预约不存在');
    }

    if (appointment.patientId !== patientId) {
      throw new Error('无权取消他人预约');
    }

    if (!appointment.canCancel()) {
      throw new Error('该预约状态不可取消');
    }

    appointment.cancel();
    const saved = await this.appointmentRepo.updateStatus(appointmentId, appointment.status);

    const doctor = await this.doctorRepo.findById(saved.doctorId);
    const doctorUser = doctor ? await this.userRepo.findById(doctor.userId) : null;
    const dept = await this.deptRepo.findById(saved.departmentId);
    const patient = await this.userRepo.findById(saved.patientId);

    return {
      id: saved.id!,
      patientId: saved.patientId,
      patientName: patient?.name || '',
      doctorId: saved.doctorId,
      doctorName: doctorUser?.name || '',
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
