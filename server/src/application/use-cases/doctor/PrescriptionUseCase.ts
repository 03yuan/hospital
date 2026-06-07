import { IPrescriptionRepository } from '../../../domain/repositories/IPrescriptionRepository';
import { IAppointmentRepository } from '../../../domain/repositories/IAppointmentRepository';
import { Prescription } from '../../../domain/entities/Prescription';
import { CreatePrescriptionRequest, PrescriptionResponse } from '../../dtos/prescription.dto';

export class PrescriptionUseCase {
  constructor(
    private readonly prescriptionRepo: IPrescriptionRepository,
    private readonly appointmentRepo: IAppointmentRepository,
  ) {}

  async addPrescription(
    doctorId: number,
    appointmentId: number,
    req: CreatePrescriptionRequest,
  ): Promise<PrescriptionResponse> {
    const appointment = await this.appointmentRepo.findById(appointmentId);
    if (!appointment) {
      throw new Error('预约不存在');
    }
    if (appointment.doctorId !== doctorId) {
      throw new Error('无权操作其他医生的预约');
    }
    if (appointment.status !== 'VISITED') {
      throw new Error('仅可对已就诊患者开药');
    }

    const prescription = new Prescription({
      appointmentId,
      medicineName: req.medicineName,
      dosage: req.dosage,
      method: req.method,
      days: req.days,
    });

    const saved = await this.prescriptionRepo.create(prescription);

    return {
      id: saved.id!,
      appointmentId: saved.appointmentId,
      medicineName: saved.medicineName,
      dosage: saved.dosage,
      method: saved.method,
      days: saved.days,
      createdAt: '',
    };
  }

  async listPrescriptions(appointmentId: number): Promise<PrescriptionResponse[]> {
    const prescriptions = await this.prescriptionRepo.findByAppointmentId(appointmentId);
    return prescriptions.map((p) => ({
      id: p.id!,
      appointmentId: p.appointmentId,
      medicineName: p.medicineName,
      dosage: p.dosage,
      method: p.method,
      days: p.days,
      createdAt: '',
    }));
  }

  async deletePrescription(prescriptionId: number): Promise<void> {
    await this.prescriptionRepo.softDelete(prescriptionId);
  }
}
