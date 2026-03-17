export interface customsTariff {
  _id: string;
  code: string;
  chapter: string;
  heading: string;
  subheading: string;
  description?: string;
  rateOfDuty?: number;
  unitOfMeasurement?: string;
  unitForDuty?: string;
  quantity?: number;
}
