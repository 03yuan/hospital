import { Router, Response } from 'express';
import { UpdateDoctorProfileUseCase } from '../../application/use-cases/doctor/UpdateDoctorProfileUseCase';
import { IDoctorRepository } from '../../domain/repositories/IDoctorRepository';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { authMiddleware, AuthenticatedRequest } from '../../middleware/auth';
import { roleGuard } from '../../middleware/roleGuard';

let doctorRepoInstance: IDoctorRepository;
let userRepoInstance: IUserRepository;

export function initDoctorProfileRoutes(doctorRepo: IDoctorRepository, userRepo: IUserRepository): Router {
  doctorRepoInstance = doctorRepo;
  userRepoInstance = userRepo;
  return doctorProfileRouter;
}

const doctorProfileRouter = Router();

doctorProfileRouter.use(authMiddleware, roleGuard('DOCTOR'));

doctorProfileRouter.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const doctor = await doctorRepoInstance.findByUserId(req.user!.userId);
    if (!doctor) { res.status(404).json({ code: 40401, data: null, message: '医生不存在' }); return; }
    const user = await userRepoInstance.findById(req.user!.userId);
    res.json({ code: 0, data: { name: user?.name, title: doctor.title, description: doctor.description, photo: doctor.photo }, message: 'ok' });
  } catch (err: any) {
    res.status(500).json({ code: 50001, data: null, message: err.message });
  }
});

doctorProfileRouter.patch('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const useCase = new UpdateDoctorProfileUseCase(doctorRepoInstance, userRepoInstance);
    const result = await useCase.execute(req.user!.userId, req.body);
    res.json({ code: 0, data: result, message: 'ok' });
  } catch (err: any) {
    res.status(500).json({ code: 50001, data: null, message: err.message });
  }
});

export { doctorProfileRouter };
