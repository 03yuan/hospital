import { Router, Response } from 'express';
import { AuthenticatedRequest, authMiddleware } from '../../middleware/auth';
import { roleGuard } from '../../middleware/roleGuard';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

router.use(authMiddleware, roleGuard('ADMIN', 'DOCTOR'));

router.get('/', async (_req: AuthenticatedRequest, res: Response) => {
  const patients = await prisma.user.findMany({
    where: { role: 'PATIENT' },
    select: { id: true, name: true, phone: true },
    orderBy: { id: 'asc' },
  });
  res.json({ code: 0, data: patients });
});

export { router as adminPatientRouter };
