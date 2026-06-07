import { Department } from '../entities/Department';
import { DeptStatus } from '../enums';

export interface IDepartmentRepository {
  findAll(includeInactive?: boolean): Promise<Department[]>;
  findById(id: number): Promise<Department | null>;
  create(department: Department): Promise<Department>;
  update(id: number, data: Partial<Department>): Promise<Department>;
  softDelete(id: number): Promise<void>;
  updateStatus(id: number, status: DeptStatus): Promise<Department>;
}
