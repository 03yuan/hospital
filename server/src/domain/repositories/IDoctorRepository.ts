import { Doctor } from '../entities/Doctor';
import { UserStatus } from '../enums';

export interface IDoctorRepository {
  findAll(includeInactive?: boolean): Promise<Doctor[]>;
  findById(id: number): Promise<Doctor | null>;
  findByUserId(userId: number): Promise<Doctor | null>;
  findByDepartmentId(departmentId: number): Promise<Doctor[]>;
  create(doctor: Doctor): Promise<Doctor>;
  update(id: number, data: Partial<Doctor>): Promise<Doctor>;
  updateStatus(id: number, status: UserStatus): Promise<Doctor>;
}
