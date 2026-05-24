import { IAppointmentRepository } from '../../../domain/repositories/IAppointmentRepository';
import { IDoctorRepository } from '../../../domain/repositories/IDoctorRepository';
import { IDepartmentRepository } from '../../../domain/repositories/IDepartmentRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { AppointmentResponse } from '../../dtos/appointment.dto';
import { AppointmentStatus } from '../../../domain/enums';

export class ListDoctorAppointmentsUseCase {
  constructor(
    private readonly appointmentRepo: IAppointmentRepository,
    private readonly doctorRepo: IDoctorRepository,
    private readonly deptRepo: IDepartmentRepository,
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(doctorId: number, date: Date, status?: AppointmentStatus): Promise<AppointmentResponse[]> {
    const appointments = await this.appointmentRepo.findByDoctorIdAndDate(doctorId, date, status);

    const result: AppointmentResponse[] = [];
    for (const a of appointments) {
      const patient = await this.userRepo.findById(a.patientId);
      const dept = await this.deptRepo.findById(a.departmentId);

      result.push({
        id: a.id!,
        patientId: a.patientId,
        patientName: patient?.name || '',
        doctorId: a.doctorId,
        doctorName: '',
        departmentId: a.departmentId,
        departmentName: dept?.name || '',
        date: a.getDateString(),
        hour: a.hour,
        status: a.status,
        symptom: a.symptom,
        diagnosis: a.diagnosis,
        createdAt: '',
      });
    }
    return result;
  }
}
