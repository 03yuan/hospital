export interface CreateAppointmentRequest {
  doctorId: number;
  scheduleId: number;
  date: string;
  hour: number;
  symptom?: string;
}

export interface UpdateDiagnosisRequest {
  diagnosis: string;
}

export interface AppointmentResponse {
  id: number;
  patientId: number;
  patientName: string;
  doctorId: number;
  doctorName: string;
  departmentId: number;
  departmentName: string;
  date: string;
  hour: number;
  status: string;
  symptom?: string;
  diagnosis?: string;
  createdAt: string;
}
