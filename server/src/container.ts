import { PrismaClient } from '@prisma/client';
import { PrismaUserRepository } from './infrastructure/repositories/PrismaUserRepository';
import { PrismaDepartmentRepository } from './infrastructure/repositories/PrismaDepartmentRepository';
import { PrismaDoctorRepository } from './infrastructure/repositories/PrismaDoctorRepository';
import { PrismaScheduleRepository } from './infrastructure/repositories/PrismaScheduleRepository';
import { PrismaAppointmentRepository } from './infrastructure/repositories/PrismaAppointmentRepository';
import { PrismaPrescriptionRepository } from './infrastructure/repositories/PrismaPrescriptionRepository';
import { PrismaNotificationRepository } from './infrastructure/repositories/PrismaNotificationRepository';
import { NotificationService } from './application/services/NotificationService';

let prisma: PrismaClient;

function getPrisma(): PrismaClient {
  if (!prisma) prisma = new PrismaClient();
  return prisma;
}

export function getUserRepository() {
  return new PrismaUserRepository(getPrisma());
}

export function getDepartmentRepository() {
  return new PrismaDepartmentRepository(getPrisma());
}

export function getDoctorRepository() {
  return new PrismaDoctorRepository(getPrisma());
}

export function getScheduleRepository() {
  return new PrismaScheduleRepository(getPrisma());
}

export function getAppointmentRepository() {
  return new PrismaAppointmentRepository(getPrisma());
}

export function getPrescriptionRepository() {
  return new PrismaPrescriptionRepository(getPrisma());
}

export function getNotificationRepository() {
  return new PrismaNotificationRepository(getPrisma());
}

export function getNotificationService() {
  return new NotificationService(getNotificationRepository());
}
