import { Router, Request, Response } from 'express';
import { DepartmentManageUseCase } from '../application/use-cases/admin/DepartmentManageUseCase';
import { IDepartmentRepository } from '../domain/repositories/IDepartmentRepository';
import { IDoctorRepository } from '../domain/repositories/IDoctorRepository';
import { IUserRepository } from '../domain/repositories/IUserRepository';

let deptRepoInstance: IDepartmentRepository;
let doctorRepoInstance: IDoctorRepository;
let userRepoInstance: IUserRepository;

export function initDepartmentRoutes(deptRepo: IDepartmentRepository, doctorRepo?: IDoctorRepository, userRepo?: IUserRepository): Router {
  deptRepoInstance = deptRepo;
  if (doctorRepo) doctorRepoInstance = doctorRepo;
  if (userRepo) userRepoInstance = userRepo;
  return departmentRouter;
}

const departmentRouter = Router();

departmentRouter.get('/', async (_req: Request, res: Response) => {
  const useCase = new DepartmentManageUseCase(deptRepoInstance);
  const depts = await useCase.list(false);
  res.json({ code: 0, data: depts, message: 'ok' });
});

departmentRouter.get('/:id/doctors', async (req: Request, res: Response) => {
  const departmentId = parseInt(req.params.id);
  const doctors = await doctorRepoInstance.findByDepartmentId(departmentId);

  const result = await Promise.all(
    doctors.map(async (doc) => {
      const user = userRepoInstance ? await userRepoInstance.findById(doc.userId) : null;
      const dept = await deptRepoInstance.findById(departmentId);
      return {
        id: doc.id,
        userId: doc.userId,
        name: user?.name || '',
        departmentId: doc.departmentId,
        departmentName: dept?.name || '',
        title: doc.title,
        description: doc.description,
        status: user?.status || '',
      };
    }),
  );

  res.json({ code: 0, data: result, message: 'ok' });
});

export { departmentRouter };
