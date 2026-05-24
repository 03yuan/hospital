import { Role, UserStatus } from '../enums';

interface UserProps {
  phone: string;
  password: string;
  name: string;
  role?: Role;
  status?: UserStatus;
}

export class User {
  public readonly id?: number;
  public phone: string;
  public password: string;
  public name: string;
  public role: Role;
  public status: UserStatus;

  constructor(props: UserProps, id?: number) {
    this.id = id;
    this.phone = props.phone;
    this.password = props.password;
    this.name = props.name;
    this.role = props.role ?? Role.PATIENT;
    this.status = props.status ?? UserStatus.ACTIVE;
  }

  disable(): void {
    this.status = UserStatus.DISABLED;
  }

  enable(): void {
    this.status = UserStatus.ACTIVE;
  }
}
