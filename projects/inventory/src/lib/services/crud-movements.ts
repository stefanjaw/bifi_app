import { ApiRequestManager } from '@avalantec/base-app/resource';
import { Injectable } from '@angular/core';
import { stockMovement } from '../interfaces/stock-movement';

@Injectable({
  providedIn: 'root',
})
export class CrudMovements extends ApiRequestManager<stockMovement> {
  constructor() {
    super();
    super.endpoint = 'inventory/movements';
  }

  override get(params: any = {}): any {
    return super.get({ ...params, getInactive: null });
  }

  override getWithPagination(params: any = {}): any {
    return super.getWithPagination({ ...params, getInactive: null });
  }
}
