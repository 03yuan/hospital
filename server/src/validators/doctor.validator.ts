import { Request, Response, NextFunction } from 'express';

export function validateUpdateStatus(req: Request, res: Response, next: NextFunction): void {
  const { status } = req.body;
  if (!status || !['VISITED', 'NO_SHOW'].includes(status)) {
    res.status(400).json({ code: 40001, data: null, message: '状态值必须为 VISITED 或 NO_SHOW' });
    return;
  }
  next();
}

export function validateDiagnosis(req: Request, res: Response, next: NextFunction): void {
  const { diagnosis } = req.body;
  if (!diagnosis || typeof diagnosis !== 'string' || diagnosis.trim().length === 0) {
    res.status(400).json({ code: 40001, data: null, message: '诊断结果不能为空' });
    return;
  }
  next();
}

export function validatePrescription(req: Request, res: Response, next: NextFunction): void {
  const { medicineName, dosage, method, days } = req.body;
  if (!medicineName || !dosage || !method || !days) {
    res.status(400).json({ code: 40001, data: null, message: '药品名称、用量、用法、天数为必填' });
    return;
  }
  if (typeof days !== 'number' || days < 1) {
    res.status(400).json({ code: 40001, data: null, message: '天数必须为正整数' });
    return;
  }
  next();
}
