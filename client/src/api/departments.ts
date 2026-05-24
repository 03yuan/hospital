import client from './client';
import { ApiResponse, Department } from '../types';

export async function getDepartments(): Promise<ApiResponse<Department[]>> {
  const res = await client.get('/departments');
  return res.data;
}
