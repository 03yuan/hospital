import { Router, Request, Response } from 'express';
import { ScheduleManageUseCase } from '../application/use-cases/admin/ScheduleManageUseCase';
import { IScheduleRepository } from '../domain/repositories/IScheduleRepository';

let scheduleRepoInstance: IScheduleRepository;

export function initScheduleRoutes(scheduleRepo: IScheduleRepository): Router {
  scheduleRepoInstance = scheduleRepo;
  return scheduleRouter;
}

const scheduleRouter = Router();

scheduleRouter.get('/:id/schedules', async (req: Request, res: Response) => {
  const doctorId = parseInt(req.params.id);
  const dateStr = req.query.date as string;
  const monthStr = req.query.month as string;
  const useCase = new ScheduleManageUseCase(scheduleRepoInstance);

  if (monthStr) {
    const [year, month] = monthStr.split('-').map(Number);
    const schedules = await useCase.getByDoctorAndMonth(doctorId, year, month);
    res.json({ code: 0, data: schedules, message: 'ok' });
    return;
  }

  if (!dateStr) {
    res.status(400).json({ code: 40001, data: null, message: '请提供 date 或 month 参数' });
    return;
  }
  const schedules = await useCase.getByDoctorAndDate(doctorId, new Date(dateStr));
  res.json({ code: 0, data: schedules, message: 'ok' });
});

export { scheduleRouter };
