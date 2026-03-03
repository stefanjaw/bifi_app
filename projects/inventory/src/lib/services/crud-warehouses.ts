import { ApiRequestManager } from '@avalantec/base-app/resource';
import { Injectable } from '@angular/core';
import { warehouse } from '../interfaces/warehouse';

@Injectable({
  providedIn: 'root',
})
export class CrudWarehouses extends ApiRequestManager<warehouse> {
  constructor() {
    super();
    super.endpoint = 'inventory/warehouses';
  }
}
