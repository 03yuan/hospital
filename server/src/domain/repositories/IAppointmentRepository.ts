import { Appointment } from '../entities/Appointment';
import { AppointmentStatus } from '../enums';

export interface IAppointmentRepository {
  findById(id: number): Promise<Appointment | null>;
  findByPatientId(patientId: number, status?: AppointmentStatus): Promise<Appointment[]>;
  findByDoctorIdAndDate(doctorId: number, date: Date, status?: AppointmentStatus): Promise<Appointment[]>;
  findPendingByPatientAndDepartment(patientId: number, departmentId: number, date: Date): Promise<Appointment[]>;
  create(appointment: Appointment): Promise<Appointment>;
  updateStatus(id: number, status: AppointmentStatus): Promise<Appointment>;
  updateDiagnosis(id: number, diagnosis: string): Promise<Appointment>;
}
