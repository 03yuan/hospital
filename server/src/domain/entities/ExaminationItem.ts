interface ExaminationItemProps {
  id?: number;
  name: string;
  category: string;
  departmentId: number;
  price: number;
  refRange?: string | null;
  unit?: string | null;
}

export class ExaminationItem {
  public readonly id?: number;
  public name: string;
  public category: string;
  public departmentId: number;
  public price: number;
  public refRange?: string | null;
  public unit?: string | null;

  constructor(props: ExaminationItemProps) {
    this.id = props.id;
    this.name = props.name;
    this.category = props.category;
    this.departmentId = props.departmentId;
    this.price = props.price;
    this.refRange = props.refRange;
    this.unit = props.unit;
  }
}
