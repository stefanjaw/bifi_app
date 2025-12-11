import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { assetRoster } from '../interfaces/asset-roster';

@Injectable({
  providedIn: 'root',
})
export class CrudAssetRoster extends ApiRequestManager<assetRoster> {
  constructor() {
    super();
    super.endpoint = 'asset-rosters';
  }
}
