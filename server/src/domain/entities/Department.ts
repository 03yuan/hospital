import { DeptStatus } from '../enums';

interface DepartmentProps {
  name: string;
  description?: string;
  status?: DeptStatus;
}

interface DepartmentUpdateProps {
  name?: string;
  description?: string;
}

export class Department {
  public readonly id?: number;
  public name: string;
  public description: string;
  public status: DeptStatus;

  constructor(props: DepartmentProps, id?: number) {
    this.id = id;
    this.name = props.name;
    this.description = props.description ?? '';
    this.status = props.status ?? DeptStatus.ACTIVE;
  }

  activate(): void {
    this.status = DeptStatus.ACTIVE;
  }

  deactivate(): void {
    this.status = DeptStatus.INACTIVE;
  }

  update(props: DepartmentUpdateProps): void {
    if (props.name !== undefined) this.name = props.name;
    if (props.description !== undefined) this.description = props.description;
  }
}
