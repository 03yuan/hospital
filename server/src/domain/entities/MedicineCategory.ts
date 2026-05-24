interface MedicineCategoryProps {
  id?: number;
  name: string;
}

export class MedicineCategory {
  public readonly id?: number;
  public name: string;

  constructor(props: MedicineCategoryProps) {
    this.id = props.id;
    this.name = props.name;
  }
}
