import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { productType } from 'projects/asset-roaster/src/public-api';

@Injectable({
  providedIn: 'root',
})
export class CrudProductType extends ApiRequestManager<productType> {
  constructor() {
    super();
    super.endpoint = 'product-types';
  }
}
