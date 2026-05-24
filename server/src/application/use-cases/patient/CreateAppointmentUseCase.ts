import { IAppointmentRepository } from '../../../domain/repositories/IAppointmentRepository';
import { IScheduleRepository } from '../../../domain/repositories/IScheduleRepository';
import { IDoctorRepository } from '../../../domain/repositories/IDoctorRepository';
import { IDepartmentRepository } from '../../../domain/repositories/IDepartmentRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { AppointmentDomainService } from '../../../domain/services/AppointmentDomainService';
import { Appointment } from '../../../domain/entities/Appointment';
import { CreateAppointmentRequest, AppointmentResponse } from '../../dtos/appointment.dto';

export class CreateAppointmentUseCase {
  constructor(
    private readonly appointmentRepo: IAppointmentRepository,
    private readonly scheduleRepo: IScheduleRepository,
    private readonly doctorRepo: IDoctorRepository,
    private readonly deptRepo: IDepartmentRepository,
    private readonly userRepo: IUserRepository,
    private readonly domainService: AppointmentDomainService,
  ) {}

  async execute(patientId: number, req: CreateAppointmentRequest): Promise<AppointmentResponse> {
    const schedule = await this.scheduleRepo.findById(req.scheduleId);
    if (!schedule) {
      throw new Error('该时段不可预约');
    }

    const dateObj = new Date(req.date);

    const validation = await this.domainService.canCreateAppointment(
      patientId, req.doctorId, schedule.doctorId, dateObj, req.hour,
    );
    if (!validation.allowed) {
      throw new Error(validation.reason);
    }

    const doctor = await this.doctorRepo.findById(req.doctorId);
    const department = await this.deptRepo.findById(schedule.doctorId);
    const doctorUser = doctor ? await this.userRepo.findById(doctor.userId) : null;
    const patient = await this.userRepo.findById(patientId);

    const appointment = new Appointment({
      patientId,
      doctorId: req.doctorId,
      departmentId: schedule.doctorId,
      scheduleId: req.scheduleId,
      date: dateObj,
      hour: req.hour,
      symptom: req.symptom,
    });

    const saved = await this.appointmentRepo.create(appointment);

    return {
      id: saved.id!,
      patientId: saved.patientId,
      patientName: patient?.name || '',
      doctorId: saved.doctorId,
      doctorName: doctorUser?.name || '',
      departmentId: saved.departmentId,
      departmentName: department?.name || '',
      date: saved.getDateString(),
      hour: saved.hour,
      status: saved.status,
      symptom: saved.symptom,
      diagnosis: saved.diagnosis,
      createdAt: '',
    };
  }
}
