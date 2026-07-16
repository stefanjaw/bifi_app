import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { orderSet } from '../interfaces/clinical-orders';

/** CRUD service for clinical order sets */
@Injectable({ providedIn: 'root' })
export class CrudOrderSets extends ApiRequestManager<orderSet> {
  constructor() {
    super();
    this.endpoint = 'order-sets';
  }
}
