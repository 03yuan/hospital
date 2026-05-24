import { Router, Request, Response } from 'express';
import { RegisterUseCase } from '../application/use-cases/auth/RegisterUseCase';
import { LoginUseCase } from '../application/use-cases/auth/LoginUseCase';
import { IUserRepository } from '../domain/repositories/IUserRepository';
import { validateRegister, validateLogin } from '../validators/auth.validator';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth';

let userRepoInstance: IUserRepository;

const router = Router();

export function initAuthRoutes(userRepo: IUserRepository): Router {
  userRepoInstance = userRepo;
  const registerUseCase = new RegisterUseCase(userRepo);
  const loginUseCase = new LoginUseCase(userRepo);

  router.post('/register', validateRegister, async (req: Request, res: Response) => {
    try {
      const result = await registerUseCase.execute(req.body);
      res.status(201).json({ code: 0, data: result, message: 'ok' });
    } catch (err: any) {
      const msg = err.message || '注册失败';
      const code = msg.includes('已注册') ? 40002 : 50001;
      res.status(code === 40002 ? 400 : 500).json({ code, data: null, message: msg });
    }
  });

  router.post('/login', validateLogin, async (req: Request, res: Response) => {
    try {
      const result = await loginUseCase.execute(req.body);
      res.json({ code: 0, data: result, message: 'ok' });
    } catch (err: any) {
      const msg = err.message || '登录失败';
      const code = msg.includes('未注册') ? 40401 : 40101;
      res.status(code === 40401 ? 404 : 401).json({ code, data: null, message: msg });
    }
  });

  router.get('/me', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const user = await userRepo.findById(req.user!.userId);
    if (!user) {
      res.status(404).json({ code: 40401, data: null, message: '用户不存在' });
      return;
    }
    res.json({ code: 0, data: { id: user.id, phone: user.phone, name: user.name, role: user.role }, message: 'ok' });
  });

  return router;
}

export { router as authRouter };
