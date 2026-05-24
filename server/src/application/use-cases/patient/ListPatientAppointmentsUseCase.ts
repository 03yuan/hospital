import { IAppointmentRepository } from '../../../domain/repositories/IAppointmentRepository';
import { IDoctorRepository } from '../../../domain/repositories/IDoctorRepository';
import { IDepartmentRepository } from '../../../domain/repositories/IDepartmentRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { AppointmentResponse } from '../../dtos/appointment.dto';
import { AppointmentStatus } from '../../../domain/enums';

export class ListPatientAppointmentsUseCase {
  constructor(
    private readonly appointmentRepo: IAppointmentRepository,
    private readonly doctorRepo: IDoctorRepository,
    private readonly deptRepo: IDepartmentRepository,
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(patientId: number, status?: AppointmentStatus): Promise<AppointmentResponse[]> {
    const appointments = await this.appointmentRepo.findByPatientId(patientId, status);

    const result: AppointmentResponse[] = [];
    for (const a of appointments) {
      const doctor = await this.doctorRepo.findById(a.doctorId);
      const doctorUser = doctor ? await this.userRepo.findById(doctor.userId) : null;
      const dept = await this.deptRepo.findById(a.departmentId);
      const patient = await this.userRepo.findById(a.patientId);

      result.push({
        id: a.id!,
        patientId: a.patientId,
        patientName: patient?.name || '',
        doctorId: a.doctorId,
        doctorName: doctorUser?.name || '',
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
