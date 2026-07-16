import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { orderMaintenance } from '../interfaces/clinical-orders';

/** CRUD service for order maintenances */
@Injectable({ providedIn: 'root' })
export class CrudOrderMaintenances extends ApiRequestManager<orderMaintenance> {
  constructor() {
    super();
    this.endpoint = 'order-maintenances';
  }
}
