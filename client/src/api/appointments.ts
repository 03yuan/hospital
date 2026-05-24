import client from './client';
import { ApiResponse, Appointment, CreateAppointmentRequest } from '../types';

export async function createAppointment(data: CreateAppointmentRequest): Promise<ApiResponse<Appointment>> {
  const res = await client.post('/appointments', {
    doctorId: data.doctorId,
    scheduleId: data.scheduleId,
    date: data.date,
    hour: data.hour,
    symptom: data.symptom || undefined,
  });
  return res.data;
}

export async function cancelAppointment(id: number): Promise<ApiResponse<Appointment>> {
  const res = await client.patch(`/appointments/${id}/cancel`);
  return res.data;
}

export async function getAppointments(status?: string): Promise<ApiResponse<Appointment[]>> {
  const params = status ? { status } : {};
  const res = await client.get('/appointments', { params });
  return res.data;
}

export async function getAppointmentById(id: number): Promise<ApiResponse<Appointment>> {
  const res = await client.get(`/appointments/${id}`);
  return res.data;
}
