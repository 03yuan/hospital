interface MedicineProps {
  id?: number;
  categoryId: number;
  name: string;
  commonDosage: string;
  commonMethod: string;
}

export class Medicine {
  public readonly id?: number;
  public categoryId: number;
  public name: string;
  public commonDosage: string;
  public commonMethod: string;

  constructor(props: MedicineProps) {
    this.id = props.id;
    this.categoryId = props.categoryId;
    this.name = props.name;
    this.commonDosage = props.commonDosage;
    this.commonMethod = props.commonMethod;
  }
}
