import { maintenanceWindow } from '../../maintenance-windows';
import { room } from '../../facilities';
import { assetType } from '../../asset-types';
import { assetMaintenance } from '../../asset-maintenances';
import { assetCommissionning } from '../../asset-commissioning';
import { contact, user } from '@avalantec/base-app/interfaces';
import { file } from '@avalantec/base-app/resource';

export type assetRosterAttachmentDescriptor = string;

export interface softwareConfiguration {
  regulatoryClassification?: 'os-middleware' | 'simd' | 'samd';
  version?: string;
  parentAssetId?: string;
  udiDi?: string;
  fdaMdrClass?: 'class-i' | 'class-ii' | 'class-iii';
  licenseType?: 'perpetual' | 'subscription-saas';
  licenseKey?: string;
  preventAutoUpdate?: boolean;
}

export interface locationAssignment {
  locationId: room;
  assignedQuantity: number;
}

export interface assetRoster {
  _id: string;
  deviceType?: 'serialized' | 'non-serialized' | 'software';
  assetTypeIds: assetType[];
  vendorIds: contact[];
  makeIds: contact[];
  productModel?: string;
  serialNumber?: string;
  description?: string;
  quantity?: number;
  locationAssignments?: locationAssignment[];
  softwareConfiguration?: softwareConfiguration;
  acquiredDate: Date;
  acquiredPrice: number;
  currentPrice: number;
  conditionId?: { _id: string; name: string; active: boolean };
  maintenanceWindowIds: maintenanceWindow[];
  photo: string;
  locationId?: room;
  warrantyDate: Date;
  supportEndDate?: Date;
  remarks?: notes[] | null;
  status: 'active' | 'awaiting-commissioning' | 'under-service' | 'decommissioned' | 'in-pm';
  minMaintenanceDate: string;
  maintenanceDate: string;
  maxMaintenanceDate: string;
  assetCommission: assetCommissionning;
  assetMaintenances: assetMaintenance[];
  attachments?: file[];
  commissionedDate?: Date;
  estimatedEconomicLifeYears?: number;
  salvageValue?: number;
  depreciationMethod?: 'straight-line' | 'accelerated-declining-balance';
  accelerationFactor?: number;
  active: boolean;
}

export interface notes {
  remark: string;
  createdBy: user;
  performDate: Date;
}
