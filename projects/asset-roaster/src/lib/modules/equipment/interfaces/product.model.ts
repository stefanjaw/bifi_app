import { contact } from '@avalantec/base-app';

export interface product {
  _id: string;
  productTypeIds: string[];
  vendorIds: contact[];
  productModel: string;
  serialNumber: string;
  acquiredDate: Date;
  acquiredPrice: number;
  currentPrice: number;
  condition: string;
  maintenanceWindowIds: string[];
  photo: string;
  locationId: string;
  warrantyDate: Date;
  remarks: string;
  active: boolean;
  productComission: string;
}
