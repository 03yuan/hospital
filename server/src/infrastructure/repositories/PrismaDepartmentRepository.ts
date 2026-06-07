import { PrismaClient } from '@prisma/client';
import { IDepartmentRepository } from '../../domain/repositories/IDepartmentRepository';
import { Department } from '../../domain/entities/Department';
import { DeptStatus } from '../../domain/enums';

export class PrismaDepartmentRepository implements IDepartmentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(includeInactive = true): Promise<Department[]> {
    const where: any = { deletedAt: null };
    if (!includeInactive) where.status = 'ACTIVE';
    const records = await this.prisma.department.findMany({ where, orderBy: { id: 'asc' } });
    return records.map((r) => new Department({ name: r.name, description: r.description ?? '', status: r.status as any }, r.id));
  }

  async findById(id: number): Promise<Department | null> {
    const record = await this.prisma.department.findUnique({ where: { id } });
    if (!record || record.deletedAt) return null;
    return new Department({ name: record.name, description: record.description ?? '', status: record.status as any }, record.id);
  }

  async create(department: Department): Promise<Department> {
    const record = await this.prisma.department.create({
      data: { name: department.name, description: department.description, status: department.status as any },
    });
    return new Department({ name: record.name, description: record.description ?? '', status: record.status as any }, record.id);
  }

  async update(id: number, data: Partial<Department>): Promise<Department> {
    const record = await this.prisma.department.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
      },
    });
    return new Department({ name: record.name, description: record.description ?? '', status: record.status as any }, record.id);
  }

  async softDelete(id: number): Promise<void> {
    await this.prisma.department.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async updateStatus(id: number, status: DeptStatus): Promise<Department> {
    const record = await this.prisma.department.update({ where: { id }, data: { status: status as any } });
    return new Department({ name: record.name, description: record.description ?? '', status: record.status as any }, record.id);
  }
}
