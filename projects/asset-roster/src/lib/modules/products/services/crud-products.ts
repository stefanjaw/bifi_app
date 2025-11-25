import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { product } from '../interfaces/product';

@Injectable({
  providedIn: 'root',
})
export class CrudProducts extends ApiRequestManager<product> {
  constructor() {
    super();
    super.endpoint = 'products';
  }
}
