import { ApiRequestManager } from '@avalantec/base-app/resource';
import { Injectable } from '@angular/core';
import { purchaseOrder, purchaseOrderStatus } from '../interfaces/purchase-order';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CrudPurchaseOrders extends ApiRequestManager<purchaseOrder> {
  constructor() {
    super();
    super.endpoint = 'purchases/orders';
  }

  /**
   * Purchase orders have no `active` field, so we override getWithPagination
   * to always pass getInactive: null — this prevents ApiRequestManager from
   * adding `active: true` to the query.
   */
  override getWithPagination(params: {
    paginateOptions?: any;
    searchParams?: any;
    sort?: any;
    specificEndpoint?: string;
    getInactive?: any;
  }) {
    return super.getWithPagination({ ...params, getInactive: null });
  }

  updateStatus(id: string, status: purchaseOrderStatus): Observable<purchaseOrder> {
    return this._httpClient.patch<purchaseOrder>(
      `${this._apiURL}/${this.endpoint}/${id}/status`,
      { status }
    );
  }
}
