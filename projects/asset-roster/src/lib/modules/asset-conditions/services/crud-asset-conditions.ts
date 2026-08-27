import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { assetCondition } from '../interfaces/asset-condition';

/**
 * Frontend CRUD client for Asset Conditions (endpoint `/asset-conditions`).
 * The backend enforces the `asset-conditions` resource for authorization.
 */
@Injectable({
  providedIn: 'root',
})
export class CrudAssetCondition extends ApiRequestManager<assetCondition> {
  constructor() {
    super();
    super.endpoint = 'asset-conditions';
  }
}
