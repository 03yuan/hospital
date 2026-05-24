import { PrismaClient } from '@prisma/client';
import { IMedicineRepository } from '../../domain/repositories/IMedicineRepository';
import { Medicine } from '../../domain/entities/Medicine';

export class PrismaMedicineRepository implements IMedicineRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByCategoryId(categoryId: number): Promise<Medicine[]> {
    const records = await this.prisma.medicine.findMany({
      where: { categoryId },
      orderBy: { id: 'asc' },
    });
    return records.map((r) => new Medicine({
      id: r.id,
      categoryId: r.categoryId,
      name: r.name,
      commonDosage: r.commonDosage,
      commonMethod: r.commonMethod,
    }));
  }

  async findAll(): Promise<Medicine[]> {
    const records = await this.prisma.medicine.findMany({
      orderBy: { categoryId: 'asc' },
    });
    return records.map((r) => new Medicine({
      id: r.id,
      categoryId: r.categoryId,
      name: r.name,
      commonDosage: r.commonDosage,
      commonMethod: r.commonMethod,
    }));
  }
}
