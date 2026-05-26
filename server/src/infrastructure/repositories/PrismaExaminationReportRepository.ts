import { PrismaClient } from '@prisma/client';
import { IExaminationReportRepository } from '../../domain/repositories/IExaminationReportRepository';

export class PrismaExaminationReportRepository implements IExaminationReportRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByOrderId(orderId: number): Promise<any> {
    const reports = await this.prisma.examinationReport.findMany({ where: { orderId } });
    return reports.length > 0 ? reports[reports.length - 1] : null;
  }

  async create(orderId: number, content: string | null, images: string | null): Promise<any> {
    return this.prisma.examinationReport.create({
      data: { orderId, content, images },
    });
  }
}
