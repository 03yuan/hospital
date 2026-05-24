import client from './client';
import { ApiResponse, MedicineCategory, Medicine } from '../types';

export async function getMedicineCategories(): Promise<ApiResponse<MedicineCategory[]>> {
  const res = await client.get('/medicine-categories');
  return res.data;
}

export async function getMedicines(categoryId?: number): Promise<ApiResponse<Medicine[]>> {
  const params = categoryId ? { categoryId } : {};
  const res = await client.get('/medicines', { params });
  return res.data;
}
