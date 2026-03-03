import { ApiRequestManager } from '@avalantec/base-app/resource';
import { Injectable } from '@angular/core';
import { product } from '../interfaces/product';

@Injectable({
  providedIn: 'root',
})
export class CrudProducts extends ApiRequestManager<product> {
  constructor() {
    super();
    super.endpoint = 'inventory/products';
  }
}
