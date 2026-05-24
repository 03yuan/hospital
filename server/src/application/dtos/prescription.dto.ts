export interface CreatePrescriptionRequest {
  medicineName: string;
  dosage: string;
  method: string;
  days: number;
}

export interface PrescriptionResponse {
  id: number;
  appointmentId: number;
  medicineName: string;
  dosage: string;
  method: string;
  days: number;
  createdAt: string;
}
