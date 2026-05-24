import { Router, Request, Response } from 'express';
import { ScheduleManageUseCase } from '../../application/use-cases/admin/ScheduleManageUseCase';
import { IScheduleRepository } from '../../domain/repositories/IScheduleRepository';
import { authMiddleware, AuthenticatedRequest } from '../../middleware/auth';
import { roleGuard } from '../../middleware/roleGuard';

let scheduleRepoInstance: IScheduleRepository;

export function initAdminScheduleRoutes(scheduleRepo: IScheduleRepository): Router {
  scheduleRepoInstance = scheduleRepo;
  return adminScheduleRouter;
}

const adminScheduleRouter = Router();

adminScheduleRouter.use(authMiddleware, roleGuard('ADMIN'));

adminScheduleRouter.get('/', async (req: AuthenticatedRequest, res: Response) => {
  const useCase = new ScheduleManageUseCase(scheduleRepoInstance);
  const doctorId = parseInt(String(req.query.doctorId));
  const month = req.query.month as string | undefined;

  if (doctorId && month) {
    const [year, m] = month.split('-').map(Number);
    const schedules = await useCase.getByDoctorAndMonth(doctorId, year, m);
    res.json({ code: 0, data: schedules, message: 'ok' });
    return;
  }

  if (doctorId && req.query.date) {
    const schedules = await useCase.getByDoctorAndDate(doctorId, new Date(String(req.query.date)));
    res.json({ code: 0, data: schedules, message: 'ok' });
    return;
  }

  if (doctorId) {
    const schedules = await useCase.getByDoctorId(doctorId);
    res.json({ code: 0, data: schedules, message: 'ok' });
    return;
  }

  res.status(400).json({ code: 40001, data: null, message: '请提供 doctorId 参数' });
});

adminScheduleRouter.post('/', async (req: Request, res: Response) => {
  const useCase = new ScheduleManageUseCase(scheduleRepoInstance);
  const result = await useCase.create(req.body.doctorId, new Date(req.body.date), req.body.hour);
  res.status(201).json({ code: 0, data: result, message: 'ok' });
});

adminScheduleRouter.delete('/:id', async (req: Request, res: Response) => {
  const useCase = new ScheduleManageUseCase(scheduleRepoInstance);
  await useCase.delete(parseInt(req.params.id));
  res.json({ code: 0, data: null, message: 'ok' });
});

adminScheduleRouter.post('/batch', async (req: Request, res: Response) => {
  const useCase = new ScheduleManageUseCase(scheduleRepoInstance);
  const result = await useCase.batchCreate(req.body);
  res.status(201).json({ code: 0, data: result, message: 'ok' });
});

export { adminScheduleRouter };
