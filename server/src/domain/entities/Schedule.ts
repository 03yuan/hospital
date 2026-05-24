interface ScheduleProps {
  doctorId: number;
  date: Date;
  hour: number;
}

export class Schedule {
  public readonly id?: number;
  public doctorId: number;
  public date: Date;
  public hour: number;

  constructor(props: ScheduleProps, id?: number) {
    if (props.hour < 0 || props.hour > 23) {
      throw new Error('Hour must be between 0 and 23');
    }
    this.id = id;
    this.doctorId = props.doctorId;
    this.date = props.date;
    this.hour = props.hour;
  }

  getDateString(): string {
    return this.date.toISOString().split('T')[0];
  }

  getTimeLabel(): string {
    const start = String(this.hour).padStart(2, '0');
    const end = String(this.hour + 1).padStart(2, '0');
    return `${start}:00-${end}:00`;
  }
}
