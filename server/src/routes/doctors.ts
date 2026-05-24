import { Router, Request, Response } from 'express';
import { IDoctorRepository } from '../domain/repositories/IDoctorRepository';

let doctorRepoInstance: IDoctorRepository;

export function initDoctorRoutes(doctorRepo: IDoctorRepository): Router {
  doctorRepoInstance = doctorRepo;
  return doctorRouter;
}

const doctorRouter = Router();

doctorRouter.get('/:id', async (req: Request, res: Response) => {
  const doctor = await doctorRepoInstance.findById(parseInt(req.params.id));
  if (!doctor) {
    res.status(404).json({ code: 40401, data: null, message: '医生不存在' });
    return;
  }
  res.json({ code: 0, data: doctor, message: 'ok' });
});

export { doctorRouter };
