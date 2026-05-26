import express from 'express';
import cors from 'cors';
import path from 'path';
import { errorHandler } from './middleware/errorHandler';
import { authRouter, initAuthRoutes } from './routes/auth';
import { profileRouter, initProfileRoutes } from './routes/profile';
import { departmentRouter, initDepartmentRoutes } from './routes/departments';
import { doctorRouter, initDoctorRoutes } from './routes/doctors';
import { scheduleRouter, initScheduleRoutes } from './routes/schedules';
import { appointmentRouter, initAppointmentRoutes } from './routes/appointments';
import { doctorAppointmentRouter, initDoctorAppointmentRoutes } from './routes/doctor/appointments';
import { doctorProfileRouter, initDoctorProfileRoutes } from './routes/doctor/profile';
import { doctorPatientRouter, initDoctorPatientRoutes } from './routes/doctor/patients';
import { uploadRouter } from './routes/upload';
import { adminDepartmentRouter, initAdminDepartmentRoutes } from './routes/admin/departments';
import { adminDoctorRouter, initAdminDoctorRoutes } from './routes/admin/doctors';
import { adminScheduleRouter, initAdminScheduleRoutes } from './routes/admin/schedules';
import { adminStatisticsRouter, initAdminStatisticsRoutes } from './routes/admin/statistics';
import { adminPatientRouter } from './routes/admin/patients';
import { notificationRouter, initNotificationRoutes } from './routes/notifications';
import { PrismaClient } from '@prisma/client';
import { PrismaUserRepository } from './infrastructure/repositories/PrismaUserRepository';
import { PrismaDepartmentRepository } from './infrastructure/repositories/PrismaDepartmentRepository';
import { PrismaDoctorRepository } from './infrastructure/repositories/PrismaDoctorRepository';
import { PrismaScheduleRepository } from './infrastructure/repositories/PrismaScheduleRepository';
import { PrismaAppointmentRepository } from './infrastructure/repositories/PrismaAppointmentRepository';
import { PrismaPrescriptionRepository } from './infrastructure/repositories/PrismaPrescriptionRepository';
import { PrismaNotificationRepository } from './infrastructure/repositories/PrismaNotificationRepository';
import { PrismaMedicineCategoryRepository } from './infrastructure/repositories/PrismaMedicineCategoryRepository';
import { PrismaMedicineRepository } from './infrastructure/repositories/PrismaMedicineRepository';
import { initMedicineRoutes } from './routes/medicines';
import { examinationRouter } from './routes/examinations';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/api/health', (_req, res) => {
  res.json({ code: 0, data: { status: 'ok' }, message: 'ok' });
});

function initRoutes() {
  const prisma = new PrismaClient();
  const userRepo = new PrismaUserRepository(prisma);
  const deptRepo = new PrismaDepartmentRepository(prisma);
  const doctorRepo = new PrismaDoctorRepository(prisma);
  const scheduleRepo = new PrismaScheduleRepository(prisma);
  const appointmentRepo = new PrismaAppointmentRepository(prisma);
  const prescriptionRepo = new PrismaPrescriptionRepository(prisma);
  const notificationRepo = new PrismaNotificationRepository(prisma);
  const medicineCategoryRepo = new PrismaMedicineCategoryRepository(prisma);
  const medicineRepo = new PrismaMedicineRepository(prisma);

  app.use('/api/auth', initAuthRoutes(userRepo));
  app.use('/api/profile', initProfileRoutes(userRepo));
  app.use('/api/departments', initDepartmentRoutes(deptRepo, doctorRepo, userRepo));
  app.use('/api/doctors', initDoctorRoutes(doctorRepo));
  app.use('/api/doctors', initScheduleRoutes(scheduleRepo));
  app.use('/api/appointments', initAppointmentRoutes(appointmentRepo, scheduleRepo, doctorRepo, deptRepo, userRepo, notificationRepo));
  app.use('/api/doctor/appointments', initDoctorAppointmentRoutes(appointmentRepo, prescriptionRepo, doctorRepo, deptRepo, userRepo, notificationRepo));
  app.use('/api/doctor/profile', initDoctorProfileRoutes(doctorRepo, userRepo));
  app.use('/api/doctor/patients', initDoctorPatientRoutes(appointmentRepo, prescriptionRepo, userRepo, deptRepo, doctorRepo));
  app.use('/api/upload', uploadRouter);
  app.use('/api/notifications', initNotificationRoutes(notificationRepo));
  app.use('/api/admin/departments', initAdminDepartmentRoutes(deptRepo));
  app.use('/api/admin/doctors', initAdminDoctorRoutes(doctorRepo, userRepo, deptRepo));
  app.use('/api/admin/schedules', initAdminScheduleRoutes(scheduleRepo));
  app.use('/api/admin/statistics', initAdminStatisticsRoutes(appointmentRepo, deptRepo, doctorRepo));
  app.use('/api/admin/patients', adminPatientRouter);
  app.use('/api', initMedicineRoutes(medicineCategoryRepo, medicineRepo));
  app.use('/api', examinationRouter);
}

initRoutes();

app.use(errorHandler);

export default app;
