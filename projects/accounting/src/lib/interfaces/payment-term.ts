export interface paymentTermLine {
  percentage: number;
  dueDays: number;
}

export interface paymentTerm {
  _id: string;
  name: string;
  active: boolean;
  lines: paymentTermLine[];
}
