import client from './client';
import { ApiResponse, ExaminationItem, ExaminationOrder } from '../types';

export async function getExaminationItems(departmentId?: number): Promise<ApiResponse<ExaminationItem[]>> {
  const params = departmentId ? { departmentId } : {};
  const res = await client.get('/examination-items', { params });
  return res.data;
}

export async function createExaminationOrder(data: {
  patientId: number;
  appointmentId?: number;
  clinicalDiag?: string;
  itemIds: number[];
}): Promise<ApiResponse<ExaminationOrder>> {
  const res = await client.post('/examination-orders', data);
  return res.data;
}

export async function getExaminationOrders(patientId?: number, appointmentId?: number): Promise<ApiResponse<ExaminationOrder[]>> {
  const params: any = {};
  if (patientId) params.patientId = patientId;
  if (appointmentId) params.appointmentId = appointmentId;
  const res = await client.get('/examination-orders', { params });
  return res.data;
}

export async function getExaminationOrderDetail(id: number): Promise<ApiResponse<ExaminationOrder>> {
  const res = await client.get(`/examination-orders/${id}`);
  return res.data;
}

export async function updateExaminationOrderStatus(id: number, status: string): Promise<ApiResponse<null>> {
  const res = await client.patch(`/examination-orders/${id}/status`, { status });
  return res.data;
}

export async function submitExaminationReport(id: number, data: { content?: string; images?: string }): Promise<ApiResponse<ExaminationOrder>> {
  const res = await client.post(`/examination-orders/${id}/report`, data);
  return res.data;
}
