import { IScheduleRepository } from '../../../domain/repositories/IScheduleRepository';
import { Schedule } from '../../../domain/entities/Schedule';
import { ScheduleResponse, BatchScheduleRequest } from '../../dtos/schedule.dto';

export class ScheduleManageUseCase {
  constructor(private readonly scheduleRepo: IScheduleRepository) {}

  async getByDoctorId(doctorId: number): Promise<ScheduleResponse[]> {
    const schedules = await this.scheduleRepo.findByDoctorId(doctorId);
    return schedules.map((s) => ({
      id: s.id!,
      doctorId: s.doctorId,
      date: s.getDateString(),
      hour: s.hour,
    }));
  }

  async getByDoctorAndDate(doctorId: number, date: Date): Promise<ScheduleResponse[]> {
    const schedules = await this.scheduleRepo.findByDoctorIdAndDate(doctorId, date);
    return schedules.map((s) => ({
      id: s.id!,
      doctorId: s.doctorId,
      date: s.getDateString(),
      hour: s.hour,
    }));
  }

  async getByDoctorAndMonth(doctorId: number, year: number, month: number): Promise<ScheduleResponse[]> {
    const schedules = await this.scheduleRepo.findByDoctorIdAndMonth(doctorId, year, month);
    return schedules.map((s) => ({
      id: s.id!,
      doctorId: s.doctorId,
      date: s.getDateString(),
      hour: s.hour,
    }));
  }

  async create(doctorId: number, date: Date, hour: number): Promise<ScheduleResponse> {
    const schedule = new Schedule({ doctorId, date, hour });
    const saved = await this.scheduleRepo.create(schedule);
    return { id: saved.id!, doctorId: saved.doctorId, date: saved.getDateString(), hour: saved.hour };
  }

  async delete(id: number): Promise<void> {
    await this.scheduleRepo.delete(id);
  }

  async batchCreate(req: BatchScheduleRequest): Promise<ScheduleResponse[]> {
    const startDate = new Date(req.dateRange.start);
    const endDate = new Date(req.dateRange.end);
    const schedules: Schedule[] = [];

    const current = new Date(startDate);
    while (current <= endDate) {
      for (const range of req.hourRanges) {
        for (let h = range.start; h < range.end; h++) {
          schedules.push(new Schedule({ doctorId: req.doctorId, date: new Date(current), hour: h }));
        }
      }
      current.setDate(current.getDate() + 1);
    }

    const saved = await this.scheduleRepo.createMany(schedules);
    return saved.map((s) => ({ id: s.id!, doctorId: s.doctorId, date: s.getDateString(), hour: s.hour }));
  }
}
