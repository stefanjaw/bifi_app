export interface sequence {
  _id: string;
  name: string;
  prefix: string;
  suffix?: string;
  number: number;
  step: number;
  size: number;
  nogap: boolean;
  active: boolean;
  description?: string;
}
