import { INotificationRepository } from '../../domain/repositories/INotificationRepository';
import { Notification } from '../../domain/entities/Notification';

export class NotificationService {
  constructor(private readonly notificationRepo: INotificationRepository) {}

  async onAppointmentCreated(
    doctorUserId: number,
    patientName: string,
    date: string,
    hour: number,
  ): Promise<void> {
    await this.notificationRepo.create(
      new Notification({
        userId: doctorUserId,
        title: '新预约提醒',
        content: `患者 ${patientName} 预约了您 ${date} ${hour}:00 的号`,
        relatedUrl: '/doctor/dashboard',
      }),
    );
  }

  async onAppointmentCancelled(
    doctorUserId: number,
    patientName: string,
    date: string,
    hour: number,
  ): Promise<void> {
    await this.notificationRepo.create(
      new Notification({
        userId: doctorUserId,
        title: '取消提醒',
        content: `患者 ${patientName} 取消了 ${date} ${hour}:00 的预约`,
        relatedUrl: '/doctor/dashboard',
      }),
    );
  }

  async onAppointmentVisited(
    patientUserId: number,
    doctorName: string,
    date: string,
  ): Promise<void> {
    await this.notificationRepo.create(
      new Notification({
        userId: patientUserId,
        title: '就诊完成',
        content: `您在 ${date} 的就诊已完成（${doctorName}）`,
        relatedUrl: '/patient/appointments',
      }),
    );
  }

  async onDiagnosisUpdated(
    patientUserId: number,
    doctorName: string,
  ): Promise<void> {
    await this.notificationRepo.create(
      new Notification({
        userId: patientUserId,
        title: '诊断已更新',
        content: `${doctorName} 更新了您的诊断结果，请查看`,
        relatedUrl: '/patient/appointments',
      }),
    );
  }

  async onPrescriptionAdded(
    patientUserId: number,
    doctorName: string,
  ): Promise<void> {
    await this.notificationRepo.create(
      new Notification({
        userId: patientUserId,
        title: '处方已开具',
        content: `${doctorName} 为您开具了新处方，请查看`,
        relatedUrl: '/patient/appointments',
      }),
    );
  }
}
