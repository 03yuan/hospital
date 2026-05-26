import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { IExaminationItemRepository } from '../domain/repositories/IExaminationItemRepository';
import { IExaminationOrderRepository } from '../domain/repositories/IExaminationOrderRepository';
import { IExaminationReportRepository } from '../domain/repositories/IExaminationReportRepository';
import { ExaminationUseCase } from '../application/use-cases/doctor/ExaminationUseCase';
import { PrismaExaminationItemRepository } from '../infrastructure/repositories/PrismaExaminationItemRepository';
import { PrismaExaminationOrderRepository } from '../infrastructure/repositories/PrismaExaminationOrderRepository';
import { PrismaExaminationReportRepository } from '../infrastructure/repositories/PrismaExaminationReportRepository';
import { PrismaNotificationRepository } from '../infrastructure/repositories/PrismaNotificationRepository';
import { NotificationService } from '../application/services/NotificationService';
import { AuthenticatedRequest, authMiddleware } from '../middleware/auth';
import { roleGuard } from '../middleware/roleGuard';

const prisma = new PrismaClient();
const itemRepo: IExaminationItemRepository = new PrismaExaminationItemRepository(prisma);
const orderRepo: IExaminationOrderRepository = new PrismaExaminationOrderRepository(prisma);
const reportRepo: IExaminationReportRepository = new PrismaExaminationReportRepository(prisma);
const useCase = new ExaminationUseCase(orderRepo, itemRepo, reportRepo, prisma);
const notificationRepo = new PrismaNotificationRepository(prisma);
const notificationService = new NotificationService(notificationRepo);

export const examinationRouter = Router();

examinationRouter.use(authMiddleware);
examinationRouter.use(roleGuard('DOCTOR', 'ADMIN', 'PATIENT'));

examinationRouter.get('/examination-items', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const departmentId = req.query.departmentId ? parseInt(req.query.departmentId as string) : undefined;
    const items = await itemRepo.findAll(departmentId);
    const data = await Promise.all(items.map(async (item) => {
      const dept = await prisma.department.findUnique({ where: { id: item.departmentId } });
      return { id: item.id, name: item.name, category: item.category, departmentId: item.departmentId, departmentName: dept?.name || '', price: item.price, refRange: item.refRange, unit: item.unit };
    }));
    res.json({ code: 0, data, message: 'ok' });
  } catch (err: any) {
    res.status(500).json({ code: 50001, data: null, message: err.message });
  }
});

examinationRouter.post('/examination-orders', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const doctor = await prisma.doctor.findUnique({ where: { userId: req.user!.userId } });
    if (!doctor) { res.status(403).json({ code: 40301, data: null, message: '非医生账号' }); return; }
    const doctorUser = await prisma.user.findUnique({ where: { id: req.user!.userId }, select: { name: true } });
    const { patientId, appointmentId, clinicalDiag, itemIds } = req.body;
    if (!patientId || !itemIds?.length) {
      res.status(400).json({ code: 40001, data: null, message: '参数不完整' });
      return;
    }
    const result = await useCase.createOrder({ patientId, doctorId: doctor.id, appointmentId, clinicalDiag, itemIds });
    // 发送通知给患者
    notificationService.onExaminationOrderCreated(patientId, doctorUser?.name || '', itemIds.length);
    res.status(201).json({ code: 0, data: result, message: 'ok' });
  } catch (err: any) {
    res.status(500).json({ code: 50001, data: null, message: err.message });
  }
});

examinationRouter.get('/examination-orders', async (req: AuthenticatedRequest, res: Response) => {
  try {
    // 按 appointmentId 过滤（医生端查看某次就诊的开单记录）
    const appointmentId = req.query.appointmentId ? parseInt(req.query.appointmentId as string) : undefined;
    if (appointmentId) {
      const data = await useCase.listByAppointment(appointmentId);
      res.json({ code: 0, data, message: 'ok' });
      return;
    }
    // 患者只能查自己的，医生/管理员可指定 patientId
    let patientId: number | undefined;
    if (req.user!.role === 'PATIENT') {
      patientId = req.user!.userId;
    } else {
      patientId = req.query.patientId ? parseInt(req.query.patientId as string) : undefined;
    }
    if (!patientId) {
      res.status(400).json({ code: 40001, data: null, message: '请提供 patientId' });
      return;
    }
    const data = await useCase.listByPatient(patientId);
    res.json({ code: 0, data, message: 'ok' });
  } catch (err: any) {
    res.status(500).json({ code: 50001, data: null, message: err.message });
  }
});

examinationRouter.get('/examination-orders/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = await useCase.getOrderDetail(Number(req.params.id));
    if (!data) { res.status(404).json({ code: 40401, data: null, message: '检查单不存在' }); return; }
    res.json({ code: 0, data, message: 'ok' });
  } catch (err: any) {
    res.status(500).json({ code: 50001, data: null, message: err.message });
  }
});

examinationRouter.patch('/examination-orders/:id/status', async (req: AuthenticatedRequest, res: Response) => {
  try {
    await useCase.updateStatus(Number(req.params.id), req.body.status);
    res.json({ code: 0, data: null, message: 'ok' });
  } catch (err: any) {
    res.status(500).json({ code: 50001, data: null, message: err.message });
  }
});

examinationRouter.post('/examination-orders/:id/report', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { content, images } = req.body;
    const data = await useCase.submitReport(Number(req.params.id), content ?? null, images ?? null);
    res.status(201).json({ code: 0, data, message: 'ok' });
  } catch (err: any) {
    res.status(500).json({ code: 50001, data: null, message: err.message });
  }
});
