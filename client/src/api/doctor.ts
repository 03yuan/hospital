import client from './client';
import { ApiResponse, Appointment, Prescription } from '../types';

export async function updateDiagnosis(id: number, diagnosis: string): Promise<ApiResponse<Appointment>> {
  const res = await client.patch(`/doctor/appointments/${id}/diagnosis`, { diagnosis });
  return res.data;
}

export async function getPrescriptions(appointmentId: number): Promise<ApiResponse<Prescription[]>> {
  const res = await client.get(`/doctor/appointments/${appointmentId}/prescriptions`);
  return res.data;
}

export async function addPrescription(appointmentId: number, data: {
  medicineName: string;
  dosage: string;
  method: string;
  days: number;
}): Promise<ApiResponse<Prescription>> {
  const res = await client.post(`/doctor/appointments/${appointmentId}/prescriptions`, data);
  return res.data;
}

export async function deletePrescription(appointmentId: number, prescriptionId: number): Promise<ApiResponse<null>> {
  const res = await client.delete(`/doctor/appointments/${appointmentId}/prescriptions/${prescriptionId}`);
  return res.data;
}
