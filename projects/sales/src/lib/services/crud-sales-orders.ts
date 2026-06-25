import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { salesOrder, salesOrderStatus } from '../interfaces/sales-order';

@Injectable({
  providedIn: 'root',
})
export class CrudSalesOrders extends ApiRequestManager<salesOrder> {
  constructor() {
    super();
    super.endpoint = 'sales-orders';
  }

  updateStatus(id: string, status: salesOrderStatus): Observable<salesOrder> {
    return this._httpClient.patch<salesOrder>(`${this._apiURL}/${this.endpoint}/${id}/status`, {
      status,
    });
  }

  openPdf(id: string): Observable<void> {
    const url = `${this._apiURL}/${this.endpoint}/${id}/pdf`;
    return this._httpClient.get(url, { responseType: 'blob' }).pipe(
      map((blob: Blob) => {
        const objectUrl = URL.createObjectURL(blob);
        const tab = window.open(objectUrl, '_blank');
        if (!tab) {
          const a = document.createElement('a');
          a.href = objectUrl;
          a.target = '_blank';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
        setTimeout(() => URL.revokeObjectURL(objectUrl), 30000);
      })
    );
  }
}
