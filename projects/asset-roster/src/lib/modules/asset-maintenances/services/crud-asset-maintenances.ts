import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { assetMaintenance } from '../interfaces/asset-maintenance';

@Injectable({
  providedIn: 'root',
})
export class CrudAssetMaintenances extends ApiRequestManager<assetMaintenance> {
  constructor() {
    super();
    this.endpoint = 'asset-maintenances';
  }
}
