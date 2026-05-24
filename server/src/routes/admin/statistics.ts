import { Router, Request, Response } from 'express';
import { StatisticsUseCase } from '../../application/use-cases/admin/StatisticsUseCase';
import { IAppointmentRepository } from '../../domain/repositories/IAppointmentRepository';
import { IDepartmentRepository } from '../../domain/repositories/IDepartmentRepository';
import { IDoctorRepository } from '../../domain/repositories/IDoctorRepository';
import { authMiddleware, AuthenticatedRequest } from '../../middleware/auth';
import { roleGuard } from '../../middleware/roleGuard';

let appointmentRepoInstance: IAppointmentRepository;
let deptRepoInstance: IDepartmentRepository;
let doctorRepoInstance: IDoctorRepository;

export function initAdminStatisticsRoutes(
  appointmentRepo: IAppointmentRepository,
  deptRepo: IDepartmentRepository,
  doctorRepo: IDoctorRepository,
): Router {
  appointmentRepoInstance = appointmentRepo;
  deptRepoInstance = deptRepo;
  doctorRepoInstance = doctorRepo;
  return adminStatisticsRouter;
}

const adminStatisticsRouter = Router();

adminStatisticsRouter.use(authMiddleware, roleGuard('ADMIN'));

adminStatisticsRouter.get('/appointments', async (req: AuthenticatedRequest, res: Response) => {
  const start = req.query.start ? new Date(req.query.start as string) : new Date();
  const end = req.query.end ? new Date(req.query.end as string) : new Date();
  const useCase = new StatisticsUseCase(appointmentRepoInstance, deptRepoInstance, doctorRepoInstance);
  const stats = await useCase.getAppointmentStats(start, end);
  res.json({ code: 0, data: stats, message: 'ok' });
});

adminStatisticsRouter.get('/departments', async (req: AuthenticatedRequest, res: Response) => {
  const start = req.query.start ? new Date(req.query.start as string) : new Date();
  const end = req.query.end ? new Date(req.query.end as string) : new Date();
  const useCase = new StatisticsUseCase(appointmentRepoInstance, deptRepoInstance, doctorRepoInstance);
  const stats = await useCase.getAppointmentStats(start, end);
  res.json({ code: 0, data: stats.byDepartment, message: 'ok' });
});

adminStatisticsRouter.get('/cancellation-rate', async (req: AuthenticatedRequest, res: Response) => {
  const start = req.query.start ? new Date(req.query.start as string) : new Date();
  const end = req.query.end ? new Date(req.query.end as string) : new Date();
  const useCase = new StatisticsUseCase(appointmentRepoInstance, deptRepoInstance, doctorRepoInstance);
  const stats = await useCase.getAppointmentStats(start, end);
  res.json({ code: 0, data: { rate: stats.cancellationRate }, message: 'ok' });
});

export { adminStatisticsRouter };
