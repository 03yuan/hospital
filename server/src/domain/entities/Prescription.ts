interface PrescriptionProps {
  id?: number;
  appointmentId: number;
  medicineName: string;
  dosage: string;
  method: string;
  days: number;
}

export class Prescription {
  public readonly id?: number;
  public appointmentId: number;
  public medicineName: string;
  public dosage: string;
  public method: string;
  public days: number;

  constructor(props: PrescriptionProps) {
    this.id = props.id;
    this.appointmentId = props.appointmentId;
    this.medicineName = props.medicineName;
    this.dosage = props.dosage;
    this.method = props.method;
    this.days = props.days;
  }
}
