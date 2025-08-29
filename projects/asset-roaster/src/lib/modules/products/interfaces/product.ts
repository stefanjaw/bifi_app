import { maintenanceWindow } from '../../maintenance-windows';
import { room } from '../../facilities';
import { productType } from '../../product-types';
import { productMaintenance } from '../../product-maintenances';
import { productComissionnig } from '../../product-comissioning';
import { contact } from '@avalantec/base-app/settings';
import { file } from '@avalantec/base-app/resource';

export type productAttachmentDescriptor = string;

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
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  maintenanceWindowIds: maintenanceWindow[];
  photo: string;
  locationId: room;
  warrantyDate: Date;
  remarks?: string;
  status: 'active' | 'awaiting-comissioning' | 'under-service' | 'decomissioned' | 'in-pm';
  minMaintenanceDate: string;
  maintenanceDate: string;
  maxMaintenanceDate: string;
  productComission: productComissionnig;
  productMaintenances: productMaintenance[];
  attachments?: file[];
  active: boolean;
}
