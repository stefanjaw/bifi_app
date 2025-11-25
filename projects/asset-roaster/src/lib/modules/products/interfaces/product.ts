import { maintenanceWindow } from '../../maintenance-windows';
import { room } from '../../facilities';
import { productType } from '../../product-types';
import { productMaintenance } from '../../product-maintenances';
import { productCommissionning } from '../../product-commissioning';
import { contact } from '@avalantec/base-app/interfaces';
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
  status: 'active' | 'awaiting-commissioning' | 'under-service' | 'decommissioned' | 'in-pm';
  minMaintenanceDate: string;
  maintenanceDate: string;
  maxMaintenanceDate: string;
  productCommission: productCommissionning;
  productMaintenances: productMaintenance[];
  attachments?: file[];
  active: boolean;
}
