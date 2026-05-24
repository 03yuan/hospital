import { Router, Request, Response } from 'express';
import { DoctorManageUseCase } from '../../application/use-cases/admin/DoctorManageUseCase';
import { IDoctorRepository } from '../../domain/repositories/IDoctorRepository';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { IDepartmentRepository } from '../../domain/repositories/IDepartmentRepository';
import { authMiddleware, AuthenticatedRequest } from '../../middleware/auth';
import { roleGuard } from '../../middleware/roleGuard';
import { UserStatus } from '../../domain/enums';

let doctorRepoInstance: IDoctorRepository;
let userRepoInstance: IUserRepository;
let deptRepoInstance: IDepartmentRepository;

export function initAdminDoctorRoutes(
  doctorRepo: IDoctorRepository,
  userRepo: IUserRepository,
  deptRepo: IDepartmentRepository,
): Router {
  doctorRepoInstance = doctorRepo;
  userRepoInstance = userRepo;
  deptRepoInstance = deptRepo;
  return adminDoctorRouter;
}

const adminDoctorRouter = Router();

adminDoctorRouter.use(authMiddleware, roleGuard('ADMIN'));

adminDoctorRouter.get('/', async (_req: Request, res: Response) => {
  const useCase = new DoctorManageUseCase(doctorRepoInstance, userRepoInstance, deptRepoInstance);
  const doctors = await useCase.list();
  res.json({ code: 0, data: doctors, message: 'ok' });
});

adminDoctorRouter.post('/', async (req: Request, res: Response) => {
  try {
    const useCase = new DoctorManageUseCase(doctorRepoInstance, userRepoInstance, deptRepoInstance);
    const result = await useCase.create(req.body);
    res.status(201).json({ code: 0, data: result, message: 'ok' });
  } catch (err: any) {
    if (err.code === 'P2002') {
      res.status(400).json({ code: 40001, data: null, message: '该手机号已被注册' });
      return;
    }
    res.status(500).json({ code: 50001, data: null, message: err.message || '创建失败' });
  }
});

adminDoctorRouter.put('/:id', async (req: Request, res: Response) => {
  const useCase = new DoctorManageUseCase(doctorRepoInstance, userRepoInstance, deptRepoInstance);
  const result = await useCase.update(parseInt(req.params.id), req.body);
  res.json({ code: 0, data: result, message: 'ok' });
});

adminDoctorRouter.patch('/:id/status', async (req: AuthenticatedRequest, res: Response) => {
  const useCase = new DoctorManageUseCase(doctorRepoInstance, userRepoInstance, deptRepoInstance);
  await useCase.updateStatus(parseInt(req.params.id), req.body.status as UserStatus);
  res.json({ code: 0, data: null, message: 'ok' });
});

export { adminDoctorRouter };
