import { Schedule } from '../entities/Schedule';

export interface IScheduleRepository {
  findById(id: number): Promise<Schedule | null>;
  findByDoctorId(doctorId: number): Promise<Schedule[]>;
  findByDoctorIdAndDate(doctorId: number, date: Date): Promise<Schedule[]>;
  findByDoctorIdAndMonth(doctorId: number, year: number, month: number): Promise<Schedule[]>;
  create(schedule: Schedule): Promise<Schedule>;
  createMany(schedules: Schedule[]): Promise<Schedule[]>;
  softDelete(id: number): Promise<void>;
}
