import client from './client';
import { ApiResponse, BatchScheduleRequest } from '../types';

export async function getAdminDepartments() {
  const res = await client.get('/admin/departments');
  return res.data;
}

export async function createAdminDepartment(data: { name: string; description?: string }) {
  const res = await client.post('/admin/departments', data);
  return res.data;
}

export async function updateAdminDepartment(id: number, data: { name: string; description?: string }) {
  const res = await client.put(`/admin/departments/${id}`, data);
  return res.data;
}

export async function deleteAdminDepartment(id: number) {
  const res = await client.delete(`/admin/departments/${id}`);
  return res.data;
}

export async function toggleAdminDepartmentStatus(id: number, status: string) {
  const res = await client.patch(`/admin/departments/${id}/status`, { status });
  return res.data;
}

export async function getAdminDoctors() {
  const res = await client.get('/admin/doctors');
  return res.data;
}

export async function createAdminDoctor(data: any) {
  const res = await client.post('/admin/doctors', data);
  return res.data;
}

export async function updateAdminDoctor(id: number, data: any) {
  const res = await client.put(`/admin/doctors/${id}`, data);
  return res.data;
}

export async function toggleAdminDoctorStatus(id: number, status: string) {
  const res = await client.patch(`/admin/doctors/${id}/status`, { status });
  return res.data;
}

export async function getAdminSchedules(doctorId: number, date?: string, month?: string) {
  const params: any = { doctorId };
  if (date) params.date = date;
  if (month) params.month = month;
  const res = await client.get('/admin/schedules', { params });
  return res.data;
}

export async function createAdminSchedule(data: { doctorId: number; date: string; hour: number }) {
  const res = await client.post('/admin/schedules', data);
  return res.data;
}

export async function deleteAdminSchedule(id: number) {
  const res = await client.delete(`/admin/schedules/${id}`);
  return res.data;
}

export async function batchCreateSchedules(data: BatchScheduleRequest) {
  const res = await client.post('/admin/schedules/batch', data);
  return res.data;
}

export async function getAppointmentStats(start?: string, end?: string) {
  const params: any = {};
  if (start) params.start = start;
  if (end) params.end = end;
  const res = await client.get('/admin/statistics/appointments', { params });
  return res.data;
}

export async function getAdminPatients() {
  const res = await client.get('/admin/patients');
  return res.data;
}
