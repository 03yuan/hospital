import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: number): Promise<User | null> {
    const record = await this.prisma.user.findUnique({ where: { id } });
    if (!record) return null;
    return new User(
      { phone: record.phone, password: record.password, name: record.name, role: record.role as any, status: record.status as any },
      record.id,
    );
  }

  async findByPhone(phone: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({ where: { phone } });
    if (!record) return null;
    return new User(
      { phone: record.phone, password: record.password, name: record.name, role: record.role as any, status: record.status as any },
      record.id,
    );
  }

  async create(user: User): Promise<User> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const record = await this.prisma.user.create({
      data: {
        phone: user.phone,
        password: hashedPassword,
        name: user.name,
        role: user.role as any,
        status: user.status as any,
      },
    });
    return new User(
      { phone: record.phone, password: record.password, name: record.name, role: record.role as any, status: record.status as any },
      record.id,
    );
  }

  async update(id: number, data: Partial<User>): Promise<User> {
    const updateData: any = { ...data };
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }
    const record = await this.prisma.user.update({
      where: { id },
      data: {
        ...(data.phone && { phone: data.phone }),
        ...(data.name && { name: data.name }),
        ...(updateData.password && { password: updateData.password }),
        ...(data.status && { status: data.status as any }),
      },
    });
    return new User(
      { phone: record.phone, password: record.password, name: record.name, role: record.role as any, status: record.status as any },
      record.id,
    );
  }
}
