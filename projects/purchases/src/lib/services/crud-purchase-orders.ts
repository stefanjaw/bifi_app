import { ApiRequestManager } from '@avalantec/base-app/resource';
import { Injectable } from '@angular/core';
import { purchaseOrder, purchaseOrderStatus } from '../interfaces/purchase-order';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
    return this._httpClient.patch<purchaseOrder>(`${this._apiURL}/${this.endpoint}/${id}/status`, {
      status,
    });
  }

  downloadPdf(id: string): Observable<void> {
    const url = `${this._apiURL}/${this.endpoint}/${id}/pdf`;
    return this._httpClient.get(url, { responseType: 'blob' }).pipe(
      map((blob: Blob) => {
        const objectUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = objectUrl;
        a.download = 'purchase-order.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(objectUrl), 10000);
      })
    );
  }
}
