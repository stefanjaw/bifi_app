export interface crmStage {
  _id: string;
  name: string;
  description?: string;
  color: string;
  order: number;
  probability: number;
  isWon: boolean;
  isLost: boolean;
  active: boolean;
}
