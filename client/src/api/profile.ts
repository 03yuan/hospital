import client from './client';
import { ApiResponse, ProfileResponse, DoctorProfileResponse, UpdateProfileRequest } from '../types';

export async function getProfile(): Promise<ApiResponse<ProfileResponse>> {
  const res = await client.get('/profile');
  return res.data;
}

export async function updateProfile(data: UpdateProfileRequest): Promise<ApiResponse<ProfileResponse>> {
  const res = await client.patch('/profile', data);
  return res.data;
}

export async function getDoctorProfile(): Promise<ApiResponse<DoctorProfileResponse>> {
  const res = await client.get('/doctor/profile');
  return res.data;
}

export async function updateDoctorProfile(data: Partial<DoctorProfileResponse>): Promise<ApiResponse<DoctorProfileResponse>> {
  const res = await client.patch('/doctor/profile', data);
  return res.data;
}

export async function getPatientHistory(patientId: number): Promise<ApiResponse<any>> {
  const res = await client.get(`/doctor/patients/${patientId}/history`);
  return res.data;
}
