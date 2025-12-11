import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { assetType } from '../interfaces/asset-type';

@Injectable({
  providedIn: 'root',
})
export class CrudAssetType extends ApiRequestManager<assetType> {
  constructor() {
    super();
    super.endpoint = 'asset-types';
  }
}
