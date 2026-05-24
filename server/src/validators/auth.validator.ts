import { Request, Response, NextFunction } from 'express';

export function validateRegister(req: Request, res: Response, next: NextFunction): void {
  const { phone, password, name } = req.body;
  if (!phone || !password || !name) {
    res.status(400).json({ code: 40001, data: null, message: '手机号、密码、姓名为必填项' });
    return;
  }
  if (!/^1\d{10}$/.test(phone)) {
    res.status(400).json({ code: 40001, data: null, message: '手机号格式不正确' });
    return;
  }
  next();
}

export function validateLogin(req: Request, res: Response, next: NextFunction): void {
  const { phone, password } = req.body;
  if (!phone || !password) {
    res.status(400).json({ code: 40001, data: null, message: '手机号和密码为必填项' });
    return;
  }
  next();
}
