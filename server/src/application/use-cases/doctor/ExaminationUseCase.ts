import { IExaminationOrderRepository } from '../../../domain/repositories/IExaminationOrderRepository';
import { IExaminationItemRepository } from '../../../domain/repositories/IExaminationItemRepository';
import { IExaminationReportRepository } from '../../../domain/repositories/IExaminationReportRepository';
import { ExaminationOrder } from '../../../domain/entities/ExaminationOrder';
import { PrismaClient } from '@prisma/client';

interface CreateOrderRequest {
  patientId: number;
  doctorId: number;
  appointmentId?: number;
  clinicalDiag?: string;
  itemIds: number[];
}

export class ExaminationUseCase {
  constructor(
    private readonly orderRepo: IExaminationOrderRepository,
    private readonly itemRepo: IExaminationItemRepository,
    private readonly reportRepo: IExaminationReportRepository,
    private readonly prisma: PrismaClient,
  ) {}

  async createOrder(req: CreateOrderRequest): Promise<any> {
    const order = new ExaminationOrder({
      patientId: req.patientId,
      doctorId: req.doctorId,
      appointmentId: req.appointmentId ?? null,
      status: 'PENDING',
      clinicalDiag: req.clinicalDiag ?? null,
    });
    const saved = await this.orderRepo.create(order);

    if (req.itemIds.length > 0) {
      await this.prisma.examinationOrderItem.createMany({
        data: req.itemIds.map((itemId) => ({
          orderId: saved.id!,
          examinationItemId: itemId,
        })),
      });
    }

    return this.getOrderDetail(saved.id!);
  }

  async getOrderDetail(orderId: number): Promise<any> {
    const record = await this.prisma.examinationOrder.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { examinationItem: true } },
        reports: true,
      },
    });
    if (!record) return null;

    return {
      id: record.id,
      patientId: record.patientId,
      doctorId: record.doctorId,
      appointmentId: record.appointmentId,
      status: record.status,
      clinicalDiag: record.clinicalDiag,
      createdAt: record.createdAt,
      items: record.items.map((i) => ({
        id: i.id,
        examinationItemId: i.examinationItemId,
        itemName: i.examinationItem.name,
        category: i.examinationItem.category,
        result: i.result,
        refRange: i.refRange || i.examinationItem.refRange,
        unit: i.unit || i.examinationItem.unit,
      })),
      report: record.reports.length > 0 ? {
        id: record.reports[0].id,
        content: record.reports[0].content,
        images: record.reports[0].images,
        createdAt: record.reports[0].createdAt,
      } : null,
    };
  }

  async listByPatient(patientId: number): Promise<any[]> {
    const records = await this.prisma.examinationOrder.findMany({
      where: { patientId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: { include: { examinationItem: true } },
        reports: true,
      },
    });
    return records.map((r) => ({
      id: r.id,
      patientId: r.patientId,
      doctorId: r.doctorId,
      appointmentId: r.appointmentId,
      status: r.status,
      clinicalDiag: r.clinicalDiag,
      createdAt: r.createdAt,
      items: r.items.map((i) => ({
        id: i.id,
        examinationItemId: i.examinationItemId,
        itemName: i.examinationItem.name,
        category: i.examinationItem.category,
        result: i.result,
        refRange: i.refRange || i.examinationItem.refRange,
        unit: i.unit || i.examinationItem.unit,
      })),
      report: r.reports.length > 0 ? {
        id: r.reports[0].id,
        content: r.reports[0].content,
        images: r.reports[0].images,
        createdAt: r.reports[0].createdAt,
      } : null,
    }));
  }

  async listByAppointment(appointmentId: number): Promise<any[]> {
    const records = await this.prisma.examinationOrder.findMany({
      where: { appointmentId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: { include: { examinationItem: true } },
        reports: true,
      },
    });
    return records.map((r) => ({
      id: r.id,
      patientId: r.patientId,
      doctorId: r.doctorId,
      appointmentId: r.appointmentId,
      status: r.status,
      clinicalDiag: r.clinicalDiag,
      createdAt: r.createdAt,
      items: r.items.map((i) => ({
        id: i.id,
        examinationItemId: i.examinationItemId,
        itemName: i.examinationItem.name,
        category: i.examinationItem.category,
        result: i.result,
        refRange: i.refRange || i.examinationItem.refRange,
        unit: i.unit || i.examinationItem.unit,
      })),
      report: r.reports.length > 0 ? {
        id: r.reports[0].id,
        content: r.reports[0].content,
        images: r.reports[0].images,
        createdAt: r.reports[0].createdAt,
      } : null,
    }));
  }

  async updateStatus(id: number, status: string): Promise<void> {
    await this.orderRepo.updateStatus(id, status);
  }

  async submitReport(orderId: number, content: string | null, images: string | null): Promise<any> {
    await this.reportRepo.create(orderId, content, images);
    await this.orderRepo.updateStatus(orderId, 'COMPLETED');
    return this.getOrderDetail(orderId);
  }
}
