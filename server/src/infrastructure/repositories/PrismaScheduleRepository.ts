import { PrismaClient } from '@prisma/client';
import { IScheduleRepository } from '../../domain/repositories/IScheduleRepository';
import { Schedule } from '../../domain/entities/Schedule';

export class PrismaScheduleRepository implements IScheduleRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: number): Promise<Schedule | null> {
    const record = await this.prisma.schedule.findUnique({ where: { id } });
    if (!record) return null;
    return new Schedule({ doctorId: record.doctorId, date: record.date, hour: record.hour }, record.id);
  }

  async findByDoctorId(doctorId: number): Promise<Schedule[]> {
    const records = await this.prisma.schedule.findMany({
      where: { doctorId },
      orderBy: [{ date: 'desc' }, { hour: 'asc' }],
    });
    return records.map((r) => new Schedule({ doctorId: r.doctorId, date: r.date, hour: r.hour }, r.id));
  }

  async findByDoctorIdAndDate(doctorId: number, date: Date): Promise<Schedule[]> {
    const dateStr = date.toISOString().split('T')[0];
    const records = await this.prisma.schedule.findMany({
      where: { doctorId, date: new Date(dateStr) },
      orderBy: { hour: 'asc' },
    });
    return records.map((r) => new Schedule({ doctorId: r.doctorId, date: r.date, hour: r.hour }, r.id));
  }

  async findByDoctorIdAndMonth(doctorId: number, year: number, month: number): Promise<Schedule[]> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    const records = await this.prisma.schedule.findMany({
      where: { doctorId, date: { gte: startDate, lte: endDate } },
      orderBy: [{ date: 'asc' }, { hour: 'asc' }],
    });
    return records.map((r) => new Schedule({ doctorId: r.doctorId, date: r.date, hour: r.hour }, r.id));
  }

  async create(schedule: Schedule): Promise<Schedule> {
    const record = await this.prisma.schedule.create({
      data: { doctorId: schedule.doctorId, date: schedule.date, hour: schedule.hour },
    });
    return new Schedule({ doctorId: record.doctorId, date: record.date, hour: record.hour }, record.id);
  }

  async createMany(schedules: Schedule[]): Promise<Schedule[]> {
    const data = schedules.map((s) => ({ doctorId: s.doctorId, date: s.date, hour: s.hour }));
    await this.prisma.schedule.createMany({ data, skipDuplicates: true });
    const doctorId = schedules[0].doctorId;
    const dates = [...new Set(schedules.map((s) => s.date.toISOString().split('T')[0]))];
    const records = await this.prisma.schedule.findMany({
      where: { doctorId, date: { in: dates.map((d) => new Date(d)) } },
      orderBy: [{ date: 'asc' }, { hour: 'asc' }],
    });
    return records.map((r) => new Schedule({ doctorId: r.doctorId, date: r.date, hour: r.hour }, r.id));
  }

  async delete(id: number): Promise<void> {
    await this.prisma.schedule.delete({ where: { id } });
  }
}
