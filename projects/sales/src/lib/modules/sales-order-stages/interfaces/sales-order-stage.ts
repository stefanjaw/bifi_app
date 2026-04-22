export interface salesOrderStage {
  _id: string;
  name: string;
  description?: string;
  color: string;
  order: number;
  isDefault: boolean;
  active: boolean;
}
