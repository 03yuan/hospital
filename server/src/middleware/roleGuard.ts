import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';

export function roleGuard(...roles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ code: 40301, data: null, message: '无权限' });
      return;
    }
    next();
  };
}
