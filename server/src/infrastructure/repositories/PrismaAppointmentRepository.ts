import { PrismaClient } from '@prisma/client';
import { IAppointmentRepository } from '../../domain/repositories/IAppointmentRepository';
import { Appointment } from '../../domain/entities/Appointment';
import { AppointmentStatus } from '../../domain/enums';

export class PrismaAppointmentRepository implements IAppointmentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private mapToEntity(record: any): Appointment {
    return new Appointment({
      id: record.id,
      patientId: record.patientId,
      doctorId: record.doctorId,
      departmentId: record.departmentId,
      scheduleId: record.scheduleId,
      date: record.date,
      hour: record.hour,
      status: record.status as any,
      symptom: record.symptom ?? undefined,
      diagnosis: record.diagnosis ?? undefined,
    });
  }

  async findById(id: number): Promise<Appointment | null> {
    const record = await this.prisma.appointment.findUnique({ where: { id } });
    if (!record) return null;
    return this.mapToEntity(record);
  }

  async findByPatientId(patientId: number, status?: AppointmentStatus): Promise<Appointment[]> {
    const where: any = { patientId };
    if (status) where.status = status;
    const records = await this.prisma.appointment.findMany({ where, orderBy: { date: 'desc' } });
    return records.map((r) => this.mapToEntity(r));
  }

  async findByDoctorIdAndDate(doctorId: number, date: Date, status?: AppointmentStatus): Promise<Appointment[]> {
    const dateStr = date.toISOString().split('T')[0];
    const where: any = { doctorId, date: new Date(dateStr) };
    if (status) where.status = status;
    const records = await this.prisma.appointment.findMany({ where, orderBy: { hour: 'asc' } });
    return records.map((r) => this.mapToEntity(r));
  }

  async findPendingByPatientAndDepartment(patientId: number, departmentId: number, date: Date): Promise<Appointment[]> {
    const dateStr = date.toISOString().split('T')[0];
    const records = await this.prisma.appointment.findMany({
      where: { patientId, departmentId, date: new Date(dateStr), status: 'PENDING' as any },
    });
    return records.map((r) => this.mapToEntity(r));
  }

  async create(appointment: Appointment): Promise<Appointment> {
    const record = await this.prisma.appointment.create({
      data: {
        patientId: appointment.patientId,
        doctorId: appointment.doctorId,
        departmentId: appointment.departmentId,
        scheduleId: appointment.scheduleId,
        date: appointment.date,
        hour: appointment.hour,
        status: appointment.status as any,
        symptom: appointment.symptom ?? null,
      },
    });
    return this.mapToEntity(record);
  }

  async updateStatus(id: number, status: AppointmentStatus): Promise<Appointment> {
    const record = await this.prisma.appointment.update({
      where: { id },
      data: { status: status as any },
    });
    return this.mapToEntity(record);
  }

  async updateDiagnosis(id: number, diagnosis: string): Promise<Appointment> {
    const record = await this.prisma.appointment.update({
      where: { id },
      data: { diagnosis },
    });
    return this.mapToEntity(record);
  }
}
