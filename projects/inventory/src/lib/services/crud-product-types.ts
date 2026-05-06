import { ApiRequestManager } from '@avalantec/base-app/resource';
import { Injectable } from '@angular/core';
import { productType } from '../interfaces/product-type';

@Injectable({
  providedIn: 'root',
})
export class CrudProductTypes extends ApiRequestManager<productType> {
  constructor() {
    super();
    super.endpoint = 'inventory/product-types';
  }
}
