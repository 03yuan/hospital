import { PrismaClient } from '@prisma/client';
import { IMedicineCategoryRepository } from '../../domain/repositories/IMedicineCategoryRepository';
import { MedicineCategory } from '../../domain/entities/MedicineCategory';

export class PrismaMedicineCategoryRepository implements IMedicineCategoryRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(): Promise<MedicineCategory[]> {
    const records = await this.prisma.medicineCategory.findMany({
      orderBy: { id: 'asc' },
    });
    return records.map((r) => new MedicineCategory({ id: r.id, name: r.name }));
  }
}
