import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { ProductMaintenance } from '../../products';

@Injectable({
  providedIn: 'root',
})
export class CrudProductMaintenances extends ApiRequestManager<ProductMaintenance> {
  constructor() {
    super();
    this.endpoint = 'product-maintenances';
  }
}
