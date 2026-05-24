import { Router, Response } from 'express';
import { INotificationRepository } from '../domain/repositories/INotificationRepository';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth';

let notificationRepoInstance: INotificationRepository;

export function initNotificationRoutes(notificationRepo: INotificationRepository): Router {
  notificationRepoInstance = notificationRepo;
  return notificationRouter;
}

const notificationRouter = Router();

notificationRouter.use(authMiddleware);

notificationRouter.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const rawRead = req.query.isRead;
    const page = parseInt(String(req.query.page || '1'), 10) || 1;
    const pageSize = parseInt(String(req.query.pageSize || '20'), 10) || 20;
    const filter = rawRead !== undefined ? { isRead: String(rawRead) === 'true' } : undefined;
    const result = await notificationRepoInstance.findByUserId(req.user!.userId, { ...filter, page, pageSize });
    const unreadCount = await notificationRepoInstance.countUnread(req.user!.userId);
    res.json({
      code: 0,
      data: {
        list: result.list.map((n) => ({
          id: n.id!,
          title: n.title,
          content: n.content,
          relatedUrl: n.relatedUrl,
          isRead: n.isRead,
          createdAt: n.createdAt.toISOString(),
        })),
        total: result.total,
        unreadCount,
      },
      message: 'ok',
    });
  } catch (err: any) {
    res.status(500).json({ code: 50001, data: null, message: err.message });
  }
});

notificationRouter.get('/unread-count', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const count = await notificationRepoInstance.countUnread(req.user!.userId);
    res.json({ code: 0, data: { count }, message: 'ok' });
  } catch (err: any) {
    res.status(500).json({ code: 50001, data: null, message: err.message });
  }
});

notificationRouter.patch('/:id/read', async (req: AuthenticatedRequest, res: Response) => {
  try {
    await notificationRepoInstance.markRead(parseInt(String(req.params.id), 10), req.user!.userId);
    res.json({ code: 0, data: null, message: 'ok' });
  } catch (err: any) {
    res.status(500).json({ code: 50001, data: null, message: err.message });
  }
});

notificationRouter.post('/read-all', async (req: AuthenticatedRequest, res: Response) => {
  try {
    await notificationRepoInstance.markAllRead(req.user!.userId);
    res.json({ code: 0, data: null, message: 'ok' });
  } catch (err: any) {
    res.status(500).json({ code: 50001, data: null, message: err.message });
  }
});

export { notificationRouter };
