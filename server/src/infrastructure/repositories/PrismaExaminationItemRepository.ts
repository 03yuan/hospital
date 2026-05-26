import { PrismaClient } from '@prisma/client';
import { IExaminationItemRepository } from '../../domain/repositories/IExaminationItemRepository';
import { ExaminationItem } from '../../domain/entities/ExaminationItem';

export class PrismaExaminationItemRepository implements IExaminationItemRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(departmentId?: number): Promise<ExaminationItem[]> {
    const where = departmentId ? { departmentId } : {};
    const records = await this.prisma.examinationItem.findMany({ where, orderBy: { id: 'asc' } });
    return records.map((r) => new ExaminationItem({
      id: r.id, name: r.name, category: r.category,
      departmentId: r.departmentId, price: Number(r.price),
      refRange: r.refRange, unit: r.unit,
    }));
  }

  async findById(id: number): Promise<ExaminationItem | null> {
    const r = await this.prisma.examinationItem.findUnique({ where: { id } });
    if (!r) return null;
    return new ExaminationItem({
      id: r.id, name: r.name, category: r.category,
      departmentId: r.departmentId, price: Number(r.price),
      refRange: r.refRange, unit: r.unit,
    });
  }
}
