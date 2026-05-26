export interface IExaminationReportRepository {
  findByOrderId(orderId: number): Promise<any>;
  create(orderId: number, content: string | null, images: string | null): Promise<any>;
}
