import { Router, Response } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { Request } from 'express';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth';

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../../uploads'),
  filename: (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('仅支持图片文件'));
      return;
    }
    cb(null, true);
  },
});

const uploadRouter = Router();

uploadRouter.post('/', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const uploadSingle = upload.single('file');
  uploadSingle(req, res, (err: any) => {
    if (err) {
      res.status(400).json({ code: 40001, data: null, message: err.message });
      return;
    }
    if (!(req as any).file) {
      res.status(400).json({ code: 40001, data: null, message: '请选择文件' });
      return;
    }
    const file = (req as any).file as Express.Multer.File;
    res.json({ code: 0, data: { url: `/uploads/${file.filename}` }, message: 'ok' });
  });
});

export { uploadRouter };
