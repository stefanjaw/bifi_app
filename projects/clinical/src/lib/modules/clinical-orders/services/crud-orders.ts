import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { order } from '../interfaces/clinical-orders';

/** CRUD service for clinical orders */
@Injectable({ providedIn: 'root' })
export class CrudOrders extends ApiRequestManager<order> {
  constructor() {
    super();
    this.endpoint = 'orders';
  }
}
