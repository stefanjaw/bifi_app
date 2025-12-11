import { maintenanceWindow } from '../../maintenance-windows';
import { room } from '../../facilities';
import { assetType } from '../../asset-types';
import { assetMaintenance } from '../../asset-maintenances';
import { assetCommissionning } from '../../asset-commissioning';
import { contact } from '@avalantec/base-app/interfaces';
import { file } from '@avalantec/base-app/resource';

export type assetRosterAttachmentDescriptor = string;

export interface assetRoster {
  _id: string;
  assetTypeIds: assetType[];
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
  assetCommission: assetCommissionning;
  assetMaintenances: assetMaintenance[];
  attachments?: file[];
  active: boolean;
}
