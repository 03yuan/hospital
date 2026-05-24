import { IAppointmentRepository } from '../../../domain/repositories/IAppointmentRepository';
import { IDepartmentRepository } from '../../../domain/repositories/IDepartmentRepository';
import { IDoctorRepository } from '../../../domain/repositories/IDoctorRepository';
import { StatisticsResponse } from '../../dtos/admin.dto';

export class StatisticsUseCase {
  constructor(
    private readonly appointmentRepo: IAppointmentRepository,
    private readonly deptRepo: IDepartmentRepository,
    private readonly doctorRepo: IDoctorRepository,
  ) {}

  async getAppointmentStats(startDate: Date, endDate: Date): Promise<StatisticsResponse> {
    const departments = await this.deptRepo.findAll(true);
    const doctors = await this.doctorRepo.findAll(true);

    const byDepartment = [];
    let totalAppointments = 0;
    let cancelledCount = 0;

    for (const dept of departments) {
      const deptDoctors = doctors.filter((d) => d.departmentId === dept.id);
      let deptCount = 0;

      for (const doc of deptDoctors) {
        let current = new Date(startDate);
        while (current <= endDate) {
          const apts = await this.appointmentRepo.findByDoctorIdAndDate(doc.id!, current);
          deptCount += apts.length;
          cancelledCount += apts.filter((a) => a.status === 'CANCELLED').length;
          current.setDate(current.getDate() + 1);
        }
      }

      totalAppointments += deptCount;
      byDepartment.push({ departmentName: dept.name, count: deptCount });
    }

    const byDoctor = [];
    for (const doc of doctors) {
      let docCount = 0;
      let current = new Date(startDate);
      while (current <= endDate) {
        const apts = await this.appointmentRepo.findByDoctorIdAndDate(doc.id!, current);
        docCount += apts.length;
        current.setDate(current.getDate() + 1);
      }
      byDoctor.push({ doctorName: doc.id.toString(), count: docCount });
    }

    return {
      totalAppointments,
      byDepartment,
      byDoctor,
      cancellationRate: totalAppointments > 0 ? cancelledCount / totalAppointments : 0,
    };
  }
}
