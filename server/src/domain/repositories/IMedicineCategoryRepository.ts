import { MedicineCategory } from '../entities/MedicineCategory';

export interface IMedicineCategoryRepository {
  findAll(): Promise<MedicineCategory[]>;
}
