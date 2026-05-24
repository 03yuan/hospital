import { PrismaClient } from '@prisma/client';
import { IPrescriptionRepository } from '../../domain/repositories/IPrescriptionRepository';
import { Prescription } from '../../domain/entities/Prescription';

export class PrismaPrescriptionRepository implements IPrescriptionRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByAppointmentId(appointmentId: number): Promise<Prescription[]> {
    const records = await this.prisma.prescription.findMany({
      where: { appointmentId },
      orderBy: { createdAt: 'asc' },
    });
    return records.map((r) => new Prescription({
      id: r.id,
      appointmentId: r.appointmentId,
      medicineName: r.medicineName,
      dosage: r.dosage,
      method: r.method,
      days: r.days,
    }));
  }

  async create(prescription: Prescription): Promise<Prescription> {
    const record = await this.prisma.prescription.create({
      data: {
        appointmentId: prescription.appointmentId,
        medicineName: prescription.medicineName,
        dosage: prescription.dosage,
        method: prescription.method,
        days: prescription.days,
      },
    });
    return new Prescription({
      id: record.id,
      appointmentId: record.appointmentId,
      medicineName: record.medicineName,
      dosage: record.dosage,
      method: record.method,
      days: record.days,
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.prescription.delete({ where: { id } });
  }
}
