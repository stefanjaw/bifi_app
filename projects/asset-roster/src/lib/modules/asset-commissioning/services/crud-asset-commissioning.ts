import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { assetCommissionning } from '../interfaces/asset-commissioning';

@Injectable({
  providedIn: 'root',
})
export class CrudAssetCommissioning extends ApiRequestManager<assetCommissionning> {
  constructor() {
    super();
    super.endpoint = 'asset-commissioning';
  }
}
