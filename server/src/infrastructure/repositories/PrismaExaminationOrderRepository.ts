import { PrismaClient } from '@prisma/client';
import { IExaminationOrderRepository } from '../../domain/repositories/IExaminationOrderRepository';
import { ExaminationOrder } from '../../domain/entities/ExaminationOrder';

export class PrismaExaminationOrderRepository implements IExaminationOrderRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(order: ExaminationOrder): Promise<ExaminationOrder> {
    const record = await this.prisma.examinationOrder.create({
      data: {
        appointmentId: order.appointmentId ?? null,
        patientId: order.patientId,
        doctorId: order.doctorId,
        status: order.status,
        clinicalDiag: order.clinicalDiag ?? null,
      },
    });
    return new ExaminationOrder({
      id: record.id, appointmentId: record.appointmentId,
      patientId: record.patientId, doctorId: record.doctorId,
      status: record.status, clinicalDiag: record.clinicalDiag,
    });
  }

  async findById(id: number): Promise<ExaminationOrder | null> {
    const record = await this.prisma.examinationOrder.findUnique({ where: { id } });
    if (!record) return null;
    return new ExaminationOrder({
      id: record.id, appointmentId: record.appointmentId,
      patientId: record.patientId, doctorId: record.doctorId,
      status: record.status, clinicalDiag: record.clinicalDiag,
    });
  }

  async findByPatientId(patientId: number): Promise<ExaminationOrder[]> {
    const records = await this.prisma.examinationOrder.findMany({
      where: { patientId },
      orderBy: { createdAt: 'desc' },
    });
    return records.map((r) => new ExaminationOrder({
      id: r.id, appointmentId: r.appointmentId,
      patientId: r.patientId, doctorId: r.doctorId,
      status: r.status, clinicalDiag: r.clinicalDiag,
    }));
  }

  async updateStatus(id: number, status: string): Promise<void> {
    await this.prisma.examinationOrder.update({ where: { id }, data: { status } });
  }
}
