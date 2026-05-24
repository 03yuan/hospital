import { Prescription } from '../entities/Prescription';

export interface IPrescriptionRepository {
  findByAppointmentId(appointmentId: number): Promise<Prescription[]>;
  create(prescription: Prescription): Promise<Prescription>;
  delete(id: number): Promise<void>;
}
