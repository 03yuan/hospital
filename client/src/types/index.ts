export type Role = 'PATIENT' | 'DOCTOR' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'DISABLED';
export type DeptStatus = 'ACTIVE' | 'INACTIVE';
export type AppointmentStatus = 'PENDING' | 'VISITED' | 'NO_SHOW' | 'CANCELLED';

export interface User {
  id: number;
  phone: string;
  name: string;
  role: Role;
  status: UserStatus;
}

export interface Department {
  id: number;
  name: string;
  description: string;
  status: DeptStatus;
}

export interface Doctor {
  id: number;
  userId: number;
  name: string;
  departmentId: number;
  departmentName: string;
  title: string;
  description: string;
  photo?: string;
  status: UserStatus;
}

export interface Schedule {
  id: number;
  doctorId: number;
  date: string;
  hour: number;
}

export interface Appointment {
  id: number;
  patientId: number;
  patientName: string;
  doctorId: number;
  doctorName: string;
  departmentId: number;
  departmentName: string;
  date: string;
  hour: number;
  status: AppointmentStatus;
  symptom?: string;
  diagnosis?: string;
  createdAt: string;
}

export interface Prescription {
  id: number;
  appointmentId: number;
  medicineName: string;
  dosage: string;
  method: string;
  days: number;
  createdAt: string;
}

export interface MedicineCategory {
  id: number;
  name: string;
}

export interface Medicine {
  id: number;
  categoryId: number;
  name: string;
  commonDosage: string;
  commonMethod: string;
}

export interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}

export interface LoginRequest {
  phone: string;
  password: string;
}

export interface RegisterRequest {
  phone: string;
  password: string;
  name: string;
}

export interface CreateAppointmentRequest {
  doctorId: number;
  scheduleId: number;
  date: string;
  hour: number;
  symptom?: string;
}

export interface BatchScheduleRequest {
  doctorId: number;
  dateRange: { start: string; end: string };
  hourRanges: { start: number; end: number }[];
}

export interface UpdateProfileRequest {
  name?: string;
  oldPassword?: string;
  newPassword?: string;
}

export interface ProfileResponse {
  id: number;
  phone: string;
  name: string;
  role: string;
}

export interface DoctorProfileResponse {
  name: string;
  title: string;
  description: string;
  photo?: string;
}

export interface PatientHistory {
  patient: { id: number; name: string; phone: string };
  appointments: {
    id: number;
    date: string;
    departmentName: string;
    doctorName: string;
    status: string;
    diagnosis?: string;
    prescriptions: Prescription[];
  }[];
}

export interface NotificationItem {
  id: number;
  title: string;
  content: string;
  relatedUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationListResponse {
  list: NotificationItem[];
  total: number;
  unreadCount: number;
}
