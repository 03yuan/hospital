import { Router, Response } from 'express';
import { CreateAppointmentUseCase } from '../application/use-cases/patient/CreateAppointmentUseCase';
import { CancelAppointmentUseCase } from '../application/use-cases/patient/CancelAppointmentUseCase';
import { ListPatientAppointmentsUseCase } from '../application/use-cases/patient/ListPatientAppointmentsUseCase';
import { IAppointmentRepository } from '../domain/repositories/IAppointmentRepository';
import { IScheduleRepository } from '../domain/repositories/IScheduleRepository';
import { IDoctorRepository } from '../domain/repositories/IDoctorRepository';
import { IDepartmentRepository } from '../domain/repositories/IDepartmentRepository';
import { IUserRepository } from '../domain/repositories/IUserRepository';
import { INotificationRepository } from '../domain/repositories/INotificationRepository';
import { AppointmentDomainService } from '../domain/services/AppointmentDomainService';
import { NotificationService } from '../application/services/NotificationService';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth';
import { validateCreateAppointment } from '../validators/patient.validator';

let appointmentRepoInstance: IAppointmentRepository;
let scheduleRepoInstance: IScheduleRepository;
let doctorRepoInstance: IDoctorRepository;
let deptRepoInstance: IDepartmentRepository;
let userRepoInstance: IUserRepository;
let notificationServiceInstance: NotificationService;

export function initAppointmentRoutes(
  appointmentRepo: IAppointmentRepository,
  scheduleRepo: IScheduleRepository,
  doctorRepo: IDoctorRepository,
  deptRepo: IDepartmentRepository,
  userRepo: IUserRepository,
  notificationRepo?: INotificationRepository,
): Router {
  appointmentRepoInstance = appointmentRepo;
  scheduleRepoInstance = scheduleRepo;
  doctorRepoInstance = doctorRepo;
  deptRepoInstance = deptRepo;
  userRepoInstance = userRepo;
  if (notificationRepo) notificationServiceInstance = new NotificationService(notificationRepo);
  return appointmentRouter;
}

const appointmentRouter = Router();

appointmentRouter.use(authMiddleware);

appointmentRouter.post('/', validateCreateAppointment, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const domainService = new AppointmentDomainService(scheduleRepoInstance, appointmentRepoInstance);
    const useCase = new CreateAppointmentUseCase(
      appointmentRepoInstance, scheduleRepoInstance, doctorRepoInstance, deptRepoInstance, userRepoInstance, domainService,
    );
    const result = await useCase.execute(req.user!.userId, { ...req.body, symptom: req.body.symptom });
    if (notificationServiceInstance) {
      const doctorUser = await userRepoInstance.findById(result.doctorId);
      if (doctorUser) {
        notificationServiceInstance.onAppointmentCreated(doctorUser.id!, result.patientName, result.date, result.hour);
      }
    }
    res.status(201).json({ code: 0, data: result, message: 'ok' });
  } catch (err: any) {
    const status = err.message?.includes('不可预约') || err.message?.includes('已有预约') ? 400 : 500;
    res.status(status).json({ code: 40002, data: null, message: err.message || '预约失败' });
  }
});

appointmentRouter.patch('/:id/cancel', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const useCase = new CancelAppointmentUseCase(appointmentRepoInstance, doctorRepoInstance, deptRepoInstance, userRepoInstance);
    const result = await useCase.execute(req.user!.userId, parseInt(req.params.id));
    if (notificationServiceInstance) {
      const doctorUser = await userRepoInstance.findById(result.doctorId);
      if (doctorUser) {
        notificationServiceInstance.onAppointmentCancelled(doctorUser.id!, result.patientName, result.date, result.hour);
      }
    }
    res.json({ code: 0, data: result, message: 'ok' });
  } catch (err: any) {
    const status = err.message?.includes('无权') ? 403 : err.message?.includes('不存在') ? 404 : 400;
    res.status(status).json({ code: 40003, data: null, message: err.message || '取消失败' });
  }
});

appointmentRouter.get('/', async (req: AuthenticatedRequest, res: Response) => {
  const useCase = new ListPatientAppointmentsUseCase(appointmentRepoInstance, doctorRepoInstance, deptRepoInstance, userRepoInstance);
  const status = req.query.status as string | undefined;
  const result = await useCase.execute(req.user!.userId, status as any);
  res.json({ code: 0, data: result, message: 'ok' });
});

export { appointmentRouter };
