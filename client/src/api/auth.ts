import client from './client';
import { LoginRequest, RegisterRequest, ApiResponse } from '../types';

export async function loginApi(data: LoginRequest): Promise<ApiResponse<{ token: string; user: any }>> {
  const res = await client.post('/auth/login', data);
  return res.data;
}

export async function registerApi(data: RegisterRequest): Promise<ApiResponse<{ token: string; user: any }>> {
  const res = await client.post('/auth/register', data);
  return res.data;
}

export async function getMeApi(): Promise<ApiResponse<any>> {
  const res = await client.get('/auth/me');
  return res.data;
}
