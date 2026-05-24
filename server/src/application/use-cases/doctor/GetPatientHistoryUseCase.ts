import { IAppointmentRepository } from '../../../domain/repositories/IAppointmentRepository';
import { IPrescriptionRepository } from '../../../domain/repositories/IPrescriptionRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IDepartmentRepository } from '../../../domain/repositories/IDepartmentRepository';
import { IDoctorRepository } from '../../../domain/repositories/IDoctorRepository';
import { PatientHistoryResponse } from '../../dtos/profile.dto';

export class GetPatientHistoryUseCase {
  constructor(
    private readonly appointmentRepo: IAppointmentRepository,
    private readonly prescriptionRepo: IPrescriptionRepository,
    private readonly userRepo: IUserRepository,
    private readonly deptRepo: IDepartmentRepository,
    private readonly doctorRepo: IDoctorRepository,
  ) {}

  async execute(doctorId: number, patientId: number): Promise<PatientHistoryResponse> {
    const patient = await this.userRepo.findById(patientId);
    if (!patient) throw new Error('患者不存在');

    const appointments = await this.appointmentRepo.findByPatientId(patientId);

    const filtered = appointments.filter((a) => a.doctorId === doctorId);
    if (filtered.length === 0) throw new Error('该患者与您无就诊记录');

    const result: PatientHistoryResponse = {
      patient: { id: patient.id!, name: patient.name, phone: patient.phone },
      appointments: [],
    };

    for (const a of appointments) {
      const dept = await this.deptRepo.findById(a.departmentId);
      const doctor = await this.doctorRepo.findById(a.doctorId);
      const doctorUser = doctor ? await this.userRepo.findById(doctor.userId) : null;
      const prescriptions = await this.prescriptionRepo.findByAppointmentId(a.id!);

      result.appointments.push({
        id: a.id!,
        date: a.getDateString(),
        departmentName: dept?.name || '',
        doctorName: doctorUser?.name || '',
        status: a.status,
        diagnosis: a.diagnosis,
        prescriptions: prescriptions.map((p) => ({
          id: p.id!,
          appointmentId: p.appointmentId,
          medicineName: p.medicineName,
          dosage: p.dosage,
          method: p.method,
          days: p.days,
          createdAt: '',
        })),
      });
    }

    result.appointments.sort((a, b) => b.date.localeCompare(a.date));

    return result;
  }
}
