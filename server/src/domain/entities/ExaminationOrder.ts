interface ExaminationOrderProps {
  id?: number;
  appointmentId?: number | null;
  patientId: number;
  doctorId: number;
  status: string;
  clinicalDiag?: string | null;
}

export class ExaminationOrder {
  public readonly id?: number;
  public appointmentId?: number | null;
  public patientId: number;
  public doctorId: number;
  public status: string;
  public clinicalDiag?: string | null;

  constructor(props: ExaminationOrderProps) {
    this.id = props.id;
    this.appointmentId = props.appointmentId;
    this.patientId = props.patientId;
    this.doctorId = props.doctorId;
    this.status = props.status;
    this.clinicalDiag = props.clinicalDiag;
  }
}
