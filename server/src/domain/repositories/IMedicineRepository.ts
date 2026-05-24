import { Medicine } from '../entities/Medicine';

export interface IMedicineRepository {
  findByCategoryId(categoryId: number): Promise<Medicine[]>;
  findAll(): Promise<Medicine[]>;
}
