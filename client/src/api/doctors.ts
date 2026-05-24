import client from './client';
import { ApiResponse, Doctor } from '../types';

export async function getDoctorsByDepartment(departmentId: number): Promise<ApiResponse<Doctor[]>> {
  const res = await client.get(`/departments/${departmentId}/doctors`);
  return res.data;
}

export async function getDoctorById(id: number): Promise<ApiResponse<Doctor>> {
  const res = await client.get(`/doctors/${id}`);
  return res.data;
}
