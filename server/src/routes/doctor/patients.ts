import { Router, Response } from 'express';
import { GetPatientHistoryUseCase } from '../../application/use-cases/doctor/GetPatientHistoryUseCase';
import { IAppointmentRepository } from '../../domain/repositories/IAppointmentRepository';
import { IPrescriptionRepository } from '../../domain/repositories/IPrescriptionRepository';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { IDepartmentRepository } from '../../domain/repositories/IDepartmentRepository';
import { IDoctorRepository } from '../../domain/repositories/IDoctorRepository';
import { authMiddleware, AuthenticatedRequest } from '../../middleware/auth';
import { roleGuard } from '../../middleware/roleGuard';

let appointmentRepoInstance: IAppointmentRepository;
let prescriptionRepoInstance: IPrescriptionRepository;
let userRepoInstance: IUserRepository;
let deptRepoInstance: IDepartmentRepository;
let doctorRepoInstance: IDoctorRepository;

export function initDoctorPatientRoutes(
  appointmentRepo: IAppointmentRepository,
  prescriptionRepo: IPrescriptionRepository,
  userRepo: IUserRepository,
  deptRepo: IDepartmentRepository,
  doctorRepo: IDoctorRepository,
): Router {
  appointmentRepoInstance = appointmentRepo;
  prescriptionRepoInstance = prescriptionRepo;
  userRepoInstance = userRepo;
  deptRepoInstance = deptRepo;
  doctorRepoInstance = doctorRepo;
  return doctorPatientRouter;
}

const doctorPatientRouter = Router();

doctorPatientRouter.use(authMiddleware, roleGuard('DOCTOR'));

async function getDoctorId(userId: number): Promise<number> {
  const doctor = await doctorRepoInstance.findByUserId(userId);
  if (!doctor) throw new Error('医生不存在');
  return doctor.id!;
}

doctorPatientRouter.get('/:patientId/history', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const doctorId = await getDoctorId(req.user!.userId);
    const useCase = new GetPatientHistoryUseCase(
      appointmentRepoInstance, prescriptionRepoInstance, userRepoInstance, deptRepoInstance, doctorRepoInstance,
    );
    const result = await useCase.execute(doctorId, parseInt(req.params.patientId));
    res.json({ code: 0, data: result, message: 'ok' });
  } catch (err: any) {
    const status = err.message?.includes('不存在') || err.message?.includes('无就诊记录') ? 404 : 500;
    res.status(status).json({ code: 40401, data: null, message: err.message });
  }
});

export { doctorPatientRouter };
