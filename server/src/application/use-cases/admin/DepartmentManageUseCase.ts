import { IDepartmentRepository } from '../../../domain/repositories/IDepartmentRepository';
import { Department } from '../../../domain/entities/Department';
import { DeptStatus } from '../../../domain/enums';
import { DepartmentDto } from '../../dtos/admin.dto';

export class DepartmentManageUseCase {
  constructor(private readonly deptRepo: IDepartmentRepository) {}

  async list(includeInactive = true): Promise<DepartmentDto[]> {
    const depts = await this.deptRepo.findAll(includeInactive);
    return depts.map((d) => ({ id: d.id, name: d.name, description: d.description, status: d.status }));
  }

  async getById(id: number): Promise<DepartmentDto | null> {
    const d = await this.deptRepo.findById(id);
    if (!d) return null;
    return { id: d.id, name: d.name, description: d.description, status: d.status };
  }

  async create(dto: DepartmentDto): Promise<DepartmentDto> {
    const dept = new Department({ name: dto.name, description: dto.description });
    const saved = await this.deptRepo.create(dept);
    return { id: saved.id, name: saved.name, description: saved.description, status: saved.status };
  }

  async update(id: number, dto: DepartmentDto): Promise<DepartmentDto> {
    const saved = await this.deptRepo.update(id, { name: dto.name, description: dto.description });
    return { id: saved.id, name: saved.name, description: saved.description, status: saved.status };
  }

  async delete(id: number): Promise<void> {
    await this.deptRepo.delete(id);
  }

  async updateStatus(id: number, status: DeptStatus): Promise<DepartmentDto> {
    const saved = await this.deptRepo.updateStatus(id, status);
    return { id: saved.id, name: saved.name, description: saved.description, status: saved.status };
  }
}
