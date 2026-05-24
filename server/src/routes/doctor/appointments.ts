import { Router, Response } from 'express';
import { ListDoctorAppointmentsUseCase } from '../../application/use-cases/doctor/ListDoctorAppointmentsUseCase';
import { UpdateAppointmentStatusUseCase } from '../../application/use-cases/doctor/UpdateAppointmentStatusUseCase';
import { UpdateDiagnosisUseCase } from '../../application/use-cases/doctor/UpdateDiagnosisUseCase';
import { PrescriptionUseCase } from '../../application/use-cases/doctor/PrescriptionUseCase';
import { IAppointmentRepository } from '../../domain/repositories/IAppointmentRepository';
import { IPrescriptionRepository } from '../../domain/repositories/IPrescriptionRepository';
import { IDoctorRepository } from '../../domain/repositories/IDoctorRepository';
import { IDepartmentRepository } from '../../domain/repositories/IDepartmentRepository';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { INotificationRepository } from '../../domain/repositories/INotificationRepository';
import { NotificationService } from '../../application/services/NotificationService';
import { authMiddleware, AuthenticatedRequest } from '../../middleware/auth';
import { roleGuard } from '../../middleware/roleGuard';
import { validateUpdateStatus, validateDiagnosis, validatePrescription } from '../../validators/doctor.validator';

let appointmentRepoInstance: IAppointmentRepository;
let prescriptionRepoInstance: IPrescriptionRepository;
let doctorRepoInstance: IDoctorRepository;
let deptRepoInstance: IDepartmentRepository;
let userRepoInstance: IUserRepository;
let notificationServiceInstance: NotificationService;

export function initDoctorAppointmentRoutes(
  appointmentRepo: IAppointmentRepository,
  prescriptionRepo: IPrescriptionRepository,
  doctorRepo: IDoctorRepository,
  deptRepo: IDepartmentRepository,
  userRepo: IUserRepository,
  notificationRepo?: INotificationRepository,
): Router {
  appointmentRepoInstance = appointmentRepo;
  prescriptionRepoInstance = prescriptionRepo;
  doctorRepoInstance = doctorRepo;
  deptRepoInstance = deptRepo;
  userRepoInstance = userRepo;
  if (notificationRepo) notificationServiceInstance = new NotificationService(notificationRepo);
  return doctorAppointmentRouter;
}

const doctorAppointmentRouter = Router();

doctorAppointmentRouter.use(authMiddleware, roleGuard('DOCTOR'));

async function getDoctorId(userId: number): Promise<number> {
  const doctor = await doctorRepoInstance.findByUserId(userId);
  if (!doctor) throw new Error('医生不存在');
  return doctor.id!;
}

async function getDoctorUserId(doctorId: number): Promise<number> {
  const doctor = await doctorRepoInstance.findById(doctorId);
  return doctor!.userId;
}

doctorAppointmentRouter.get('/', async (req: AuthenticatedRequest, res: Response) => {
  const dateStr = req.query.date as string;
  if (!dateStr) {
    res.status(400).json({ code: 40001, data: null, message: '请提供日期参数' });
    return;
  }
  try {
    const doctorId = await getDoctorId(req.user!.userId);
    const useCase = new ListDoctorAppointmentsUseCase(appointmentRepoInstance, doctorRepoInstance, deptRepoInstance, userRepoInstance);
    const result = await useCase.execute(doctorId, new Date(dateStr));
    res.json({ code: 0, data: result, message: 'ok' });
  } catch (err: any) {
    res.status(500).json({ code: 50001, data: null, message: err.message });
  }
});

doctorAppointmentRouter.patch('/:id/status', validateUpdateStatus, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const doctorId = await getDoctorId(req.user!.userId);
    const useCase = new UpdateAppointmentStatusUseCase(appointmentRepoInstance, doctorRepoInstance, deptRepoInstance, userRepoInstance);
    const result = await useCase.execute(doctorId, parseInt(req.params.id), req.body.status);
    if (notificationServiceInstance && result.status === 'VISITED') {
      const doctorUser = await userRepoInstance.findById(req.user!.userId);
      notificationServiceInstance.onAppointmentVisited(result.patientId, doctorUser?.name || '', result.date);
    }
    res.json({ code: 0, data: result, message: 'ok' });
  } catch (err: any) {
    const status = err.message?.includes('无权') ? 403 : 400;
    res.status(status).json({ code: 40003, data: null, message: err.message || '操作失败' });
  }
});

doctorAppointmentRouter.patch('/:id/diagnosis', validateDiagnosis, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const doctorId = await getDoctorId(req.user!.userId);
    const useCase = new UpdateDiagnosisUseCase(appointmentRepoInstance, doctorRepoInstance, deptRepoInstance, userRepoInstance);
    const result = await useCase.execute(doctorId, parseInt(req.params.id), req.body.diagnosis);
    if (notificationServiceInstance) {
      const doctorUser = await userRepoInstance.findById(req.user!.userId);
      notificationServiceInstance.onDiagnosisUpdated(result.patientId, doctorUser?.name || '');
    }
    res.json({ code: 0, data: result, message: 'ok' });
  } catch (err: any) {
    const status = err.message?.includes('无权') ? 403 : err.message?.includes('不存在') ? 404 : 400;
    res.status(status).json({ code: 40003, data: null, message: err.message || '操作失败' });
  }
});

doctorAppointmentRouter.get('/:id/prescriptions', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const useCase = new PrescriptionUseCase(prescriptionRepoInstance, appointmentRepoInstance);
    const result = await useCase.listPrescriptions(parseInt(req.params.id));
    res.json({ code: 0, data: result, message: 'ok' });
  } catch (err: any) {
    res.status(500).json({ code: 50001, data: null, message: err.message });
  }
});

doctorAppointmentRouter.post('/:id/prescriptions', validatePrescription, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const doctorId = await getDoctorId(req.user!.userId);
    const useCase = new PrescriptionUseCase(prescriptionRepoInstance, appointmentRepoInstance);
    const result = await useCase.addPrescription(doctorId, parseInt(req.params.id), req.body);
    if (notificationServiceInstance) {
      const appointment = await appointmentRepoInstance.findById(parseInt(req.params.id));
      if (appointment) {
        const doctorUser = await userRepoInstance.findById(req.user!.userId);
        notificationServiceInstance.onPrescriptionAdded(appointment.patientId, doctorUser?.name || '');
      }
    }
    res.status(201).json({ code: 0, data: result, message: 'ok' });
  } catch (err: any) {
    const status = err.message?.includes('无权') ? 403 : err.message?.includes('不存在') ? 404 : 400;
    res.status(status).json({ code: 40003, data: null, message: err.message || '操作失败' });
  }
});

doctorAppointmentRouter.delete('/:id/prescriptions/:prescriptionId', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const useCase = new PrescriptionUseCase(prescriptionRepoInstance, appointmentRepoInstance);
    await useCase.deletePrescription(parseInt(req.params.prescriptionId));
    res.json({ code: 0, data: null, message: 'ok' });
  } catch (err: any) {
    res.status(500).json({ code: 50001, data: null, message: err.message });
  }
});

export { doctorAppointmentRouter };
