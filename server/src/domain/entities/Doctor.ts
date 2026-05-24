interface DoctorProps {
  userId: number;
  departmentId: number;
  title: string;
  description?: string;
  photo?: string;
}

export class Doctor {
  public readonly id?: number;
  public userId: number;
  public departmentId: number;
  public title: string;
  public description: string;
  public photo?: string;

  constructor(props: DoctorProps, id?: number) {
    this.id = id;
    this.userId = props.userId;
    this.departmentId = props.departmentId;
    this.title = props.title;
    this.description = props.description ?? '';
    this.photo = props.photo;
  }

  updateDepartment(departmentId: number): void {
    this.departmentId = departmentId;
  }

  updateTitle(title: string): void {
    this.title = title;
  }
}
