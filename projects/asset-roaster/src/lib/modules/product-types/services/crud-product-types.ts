import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { productType } from '../interfaces/product-type';

@Injectable({
  providedIn: 'root',
})
export class CrudProductType extends ApiRequestManager<productType> {
  constructor() {
    super();
    super.endpoint = 'product-types';
  }
}
