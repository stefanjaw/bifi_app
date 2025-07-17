import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app';
import { product } from '@avalantec/asset-roaster/modules/products/interfaces/product.model';

@Injectable({
  providedIn: 'root',
})
export class CrudProductsService extends ApiRequestManager<product> {
  constructor() {
    super();
    super.endpoint = 'products';
  }
}
