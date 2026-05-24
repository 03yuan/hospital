export interface DoctorResponse {
  id: number;
  userId: number;
  name: string;
  departmentId: number;
  departmentName: string;
  title: string;
  description: string;
  status: string;
}

export interface UpdateStatusRequest {
  status: 'VISITED' | 'NO_SHOW';
}
