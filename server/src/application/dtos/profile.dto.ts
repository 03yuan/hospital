import { PrescriptionResponse } from './prescription.dto';

export interface UpdateProfileRequest {
  name?: string;
  oldPassword?: string;
  newPassword?: string;
}

export interface UpdateDoctorProfileRequest {
  name?: string;
  title?: string;
  description?: string;
  photo?: string;
}

export interface ProfileResponse {
  id: number;
  phone: string;
  name: string;
  role: string;
}

export interface PatientHistoryResponse {
  patient: { id: number; name: string; phone: string };
  appointments: {
    id: number;
    date: string;
    departmentName: string;
    doctorName: string;
    status: string;
    diagnosis?: string;
    prescriptions: PrescriptionResponse[];
  }[];
}
