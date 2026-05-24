import { Router, Response } from 'express';
import { UpdateProfileUseCase } from '../application/use-cases/auth/UpdateProfileUseCase';
import { IUserRepository } from '../domain/repositories/IUserRepository';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth';

let userRepoInstance: IUserRepository;

export function initProfileRoutes(userRepo: IUserRepository): Router {
  userRepoInstance = userRepo;
  return profileRouter;
}

const profileRouter = Router();

profileRouter.use(authMiddleware);

profileRouter.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await userRepoInstance.findById(req.user!.userId);
    if (!user) { res.status(404).json({ code: 40401, data: null, message: '用户不存在' }); return; }
    res.json({ code: 0, data: { id: user.id, phone: user.phone, name: user.name, role: user.role }, message: 'ok' });
  } catch (err: any) {
    res.status(500).json({ code: 50001, data: null, message: err.message });
  }
});

profileRouter.patch('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const useCase = new UpdateProfileUseCase(userRepoInstance);
    const result = await useCase.execute(req.user!.userId, req.body);
    res.json({ code: 0, data: result, message: 'ok' });
  } catch (err: any) {
    const status = err.message?.includes('不存在') ? 404 : err.message?.includes('原密码错误') ? 400 : 500;
    res.status(status).json({ code: 40001, data: null, message: err.message });
  }
});

export { profileRouter };
