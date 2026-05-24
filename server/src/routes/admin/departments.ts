import { Router, Request, Response } from 'express';
import { DepartmentManageUseCase } from '../../application/use-cases/admin/DepartmentManageUseCase';
import { IDepartmentRepository } from '../../domain/repositories/IDepartmentRepository';
import { authMiddleware, AuthenticatedRequest } from '../../middleware/auth';
import { roleGuard } from '../../middleware/roleGuard';
import { DeptStatus } from '../../domain/enums';

let deptRepoInstance: IDepartmentRepository;

export function initAdminDepartmentRoutes(deptRepo: IDepartmentRepository): Router {
  deptRepoInstance = deptRepo;
  return adminDepartmentRouter;
}

const adminDepartmentRouter = Router();

adminDepartmentRouter.use(authMiddleware, roleGuard('ADMIN'));

adminDepartmentRouter.get('/', async (_req: Request, res: Response) => {
  const useCase = new DepartmentManageUseCase(deptRepoInstance);
  const depts = await useCase.list(true);
  res.json({ code: 0, data: depts, message: 'ok' });
});

adminDepartmentRouter.post('/', async (req: Request, res: Response) => {
  const useCase = new DepartmentManageUseCase(deptRepoInstance);
  const result = await useCase.create(req.body);
  res.status(201).json({ code: 0, data: result, message: 'ok' });
});

adminDepartmentRouter.put('/:id', async (req: Request, res: Response) => {
  const useCase = new DepartmentManageUseCase(deptRepoInstance);
  const result = await useCase.update(parseInt(req.params.id), req.body);
  res.json({ code: 0, data: result, message: 'ok' });
});

adminDepartmentRouter.delete('/:id', async (req: Request, res: Response) => {
  const useCase = new DepartmentManageUseCase(deptRepoInstance);
  await useCase.delete(parseInt(req.params.id));
  res.json({ code: 0, data: null, message: 'ok' });
});

adminDepartmentRouter.patch('/:id/status', async (req: AuthenticatedRequest, res: Response) => {
  const useCase = new DepartmentManageUseCase(deptRepoInstance);
  const result = await useCase.updateStatus(parseInt(req.params.id), req.body.status as DeptStatus);
  res.json({ code: 0, data: result, message: 'ok' });
});

export { adminDepartmentRouter };
