import { ExaminationItem } from '../entities/ExaminationItem';

export interface IExaminationItemRepository {
  findAll(departmentId?: number): Promise<ExaminationItem[]>;
  findById(id: number): Promise<ExaminationItem | null>;
}
