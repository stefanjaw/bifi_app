import { ApiRequestManager } from '@avalantec/base-app/resource';
import { Injectable } from '@angular/core';
import { stockBalance } from '../interfaces/stock-balance';

@Injectable({
  providedIn: 'root',
})
export class CrudStockBalances extends ApiRequestManager<stockBalance> {
  constructor() {
    super();
    super.endpoint = 'inventory/stock-balances';
  }

  override get(params: any = {}): any {
    return super.get({ ...params, getInactive: null });
  }

  override getWithPagination(params: any = {}): any {
    return super.getWithPagination({ ...params, getInactive: null });
  }
}
