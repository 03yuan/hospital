import { Request, Response, NextFunction } from 'express';

export function validateCreateAppointment(req: Request, res: Response, next: NextFunction): void {
  const { doctorId, scheduleId, date, hour } = req.body;
  if (!doctorId || !scheduleId || !date || hour === undefined) {
    res.status(400).json({ code: 40001, data: null, message: '必填字段缺失' });
    return;
  }
  if (hour < 0 || hour > 23) {
    res.status(400).json({ code: 40001, data: null, message: '小时值无效' });
    return;
  }
  next();
}
