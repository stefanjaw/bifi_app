import { contact } from '@avalantec/base-app';
import { maintenanceWindow } from '../../maintenance-windows';
import { room } from '../../facilities';
import { productType } from '../../product-types';

export interface product {
  _id: string;
  productTypeIds: productType[];
  vendorIds: contact[];
  makeIds: contact[];
  productModel: string;
  serialNumber: string;
  acquiredDate: Date;
  acquiredPrice: number;
  currentPrice: number;
  condition: string;
  maintenanceWindowIds: maintenanceWindow[];
  photo: string;
  locationId: room;
  warrantyDate: Date;
  remarks: string;
  active: boolean;
  productComission: string;
  productMaintenance: string;
  status: 'active' | 'awaiting-comissioning' | 'under-service';
  pmDue: 'pm-not-set' | 'in-pm' | 'pm-due' | 'pm-overdue';
}
