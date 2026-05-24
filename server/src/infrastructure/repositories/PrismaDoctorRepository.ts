import { PrismaClient } from '@prisma/client';
import { IDoctorRepository } from '../../domain/repositories/IDoctorRepository';
import { Doctor } from '../../domain/entities/Doctor';
import { UserStatus } from '../../domain/enums';

export class PrismaDoctorRepository implements IDoctorRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private mapToEntity(r: any): Doctor {
    return new Doctor({ userId: r.userId, departmentId: r.departmentId, title: r.title, description: r.description ?? '', photo: r.photo ?? undefined }, r.id);
  }

  async findAll(includeInactive = true): Promise<Doctor[]> {
    const where: any = {};
    if (!includeInactive) where.user = { status: 'ACTIVE' };
    const records = await this.prisma.doctor.findMany({ where, include: { user: true } });
    return records.map((r) => this.mapToEntity(r));
  }

  async findByUserId(userId: number): Promise<Doctor | null> {
    const record = await this.prisma.doctor.findUnique({ where: { userId }, include: { user: true } });
    if (!record) return null;
    return this.mapToEntity(record);
  }

  async findById(id: number): Promise<Doctor | null> {
    const record = await this.prisma.doctor.findUnique({ where: { id }, include: { user: true } });
    if (!record) return null;
    return this.mapToEntity(record);
  }

  async findByDepartmentId(departmentId: number): Promise<Doctor[]> {
    const records = await this.prisma.doctor.findMany({
      where: { departmentId, user: { status: 'ACTIVE' } },
      include: { user: true },
    });
    return records.map((r) => this.mapToEntity(r));
  }

  async create(doctor: Doctor): Promise<Doctor> {
    const record = await this.prisma.doctor.create({
      data: { id: doctor.userId, userId: doctor.userId, departmentId: doctor.departmentId, title: doctor.title, description: doctor.description },
    });
    return this.mapToEntity(record);
  }

  async update(id: number, data: Partial<Doctor>): Promise<Doctor> {
    const record = await this.prisma.doctor.update({
      where: { id },
      data: {
        ...(data.departmentId && { departmentId: data.departmentId }),
        ...(data.title && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.photo !== undefined && { photo: data.photo }),
      },
    });
    return this.mapToEntity(record);
  }

  async updateStatus(id: number, status: UserStatus): Promise<Doctor> {
    const doctor = await this.prisma.doctor.findUnique({ where: { id } });
    if (!doctor) throw new Error('医生不存在');
    await this.prisma.user.update({ where: { id: doctor.userId }, data: { status: status as any } });
    return this.mapToEntity(doctor);
  }
}
