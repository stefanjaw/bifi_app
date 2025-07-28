import { Injectable } from '@angular/core';
import { product } from '@avalantec/asset-roaster/modules/products/interfaces/product';
import { ApiRequestManager } from '@avalantec/base-app/resource';

@Injectable({
  providedIn: 'root',
})
export class CrudProducts extends ApiRequestManager<product> {
  constructor() {
    super();
    super.endpoint = 'products';
  }
}
