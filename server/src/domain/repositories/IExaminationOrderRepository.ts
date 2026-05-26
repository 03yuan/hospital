import { ExaminationOrder } from '../entities/ExaminationOrder';

export interface IExaminationOrderRepository {
  create(order: ExaminationOrder): Promise<ExaminationOrder>;
  findById(id: number): Promise<ExaminationOrder | null>;
  findByPatientId(patientId: number): Promise<ExaminationOrder[]>;
  updateStatus(id: number, status: string): Promise<void>;
}
