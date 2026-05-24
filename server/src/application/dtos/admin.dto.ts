export interface DepartmentDto {
  id?: number;
  name: string;
  description?: string;
  status?: string;
}

export interface DoctorManageDto {
  id?: number;
  phone: string;
  password?: string;
  name: string;
  departmentId: number;
  departmentName?: string;
  title: string;
  description?: string;
  status?: string;
}

export interface StatisticsResponse {
  totalAppointments: number;
  byDepartment: { departmentName: string; count: number }[];
  byDoctor: { doctorName: string; count: number }[];
  cancellationRate: number;
}
