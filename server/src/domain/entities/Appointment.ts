import { AppointmentStatus } from '../enums';

interface AppointmentProps {
  patientId: number;
  doctorId: number;
  departmentId: number;
  scheduleId: number;
  date: Date;
  hour: number;
  status?: AppointmentStatus;
  symptom?: string;
  diagnosis?: string;
  id?: number;
}

export class Appointment {
  public readonly id?: number;
  public patientId: number;
  public doctorId: number;
  public departmentId: number;
  public scheduleId: number;
  public date: Date;
  public hour: number;
  public status: AppointmentStatus;
  public symptom?: string;
  public diagnosis?: string;

  constructor(props: AppointmentProps) {
    this.id = props.id;
    this.patientId = props.patientId;
    this.doctorId = props.doctorId;
    this.departmentId = props.departmentId;
    this.scheduleId = props.scheduleId;
    this.date = props.date;
    this.hour = props.hour;
    this.status = props.status ?? AppointmentStatus.PENDING;
    this.symptom = props.symptom;
    this.diagnosis = props.diagnosis;
  }

  getDateString(): string {
    return this.date.toISOString().split('T')[0];
  }

  canCancel(): boolean {
    return this.status === AppointmentStatus.PENDING;
  }

  cancel(): void {
    if (this.status === AppointmentStatus.VISITED) {
      throw new Error('Cannot cancel a VISITED appointment');
    }
    if (this.status === AppointmentStatus.NO_SHOW) {
      throw new Error('Cannot cancel a NO_SHOW appointment');
    }
    if (this.status === AppointmentStatus.CANCELLED) {
      throw new Error('Cannot cancel a CANCELLED appointment');
    }
    this.status = AppointmentStatus.CANCELLED;
  }

  markVisited(): void {
    if (this.status === AppointmentStatus.CANCELLED) {
      throw new Error('Cannot mark a CANCELLED appointment as visited');
    }
    if (this.status === AppointmentStatus.NO_SHOW) {
      throw new Error('Cannot mark a NO_SHOW appointment as visited');
    }
    this.status = AppointmentStatus.VISITED;
  }

  markNoShow(): void {
    if (this.status === AppointmentStatus.VISITED) {
      throw new Error('Cannot mark a VISITED appointment as no-show');
    }
    if (this.status === AppointmentStatus.CANCELLED) {
      throw new Error('Cannot mark a CANCELLED appointment as no-show');
    }
    this.status = AppointmentStatus.NO_SHOW;
  }
}
