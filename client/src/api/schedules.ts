import client from './client';
import { ApiResponse, Schedule } from '../types';

export async function getSchedules(doctorId: number, date: string): Promise<ApiResponse<Schedule[]>> {
  const res = await client.get(`/doctors/${doctorId}/schedules`, { params: { date } });
  return res.data;
}

export async function getSchedulesByMonth(doctorId: number, month: string): Promise<ApiResponse<Schedule[]>> {
  const res = await client.get(`/doctors/${doctorId}/schedules`, { params: { month } });
  return res.data;
}
