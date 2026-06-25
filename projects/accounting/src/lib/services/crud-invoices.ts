import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { invoice } from '../interfaces/invoice';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CrudInvoices extends ApiRequestManager<invoice> {
  constructor() {
    super();
    this.endpoint = 'accounting/invoices';
  }

  getPayments(invoiceId: string): Observable<any[]> {
    return this._httpClient.get<any[]>(`${this._apiURL}/accounting/invoices/${invoiceId}/payments`);
  }

  registerPayment(invoiceId: string, data: any): Observable<any> {
    return this._httpClient.post<any>(
      `${this._apiURL}/accounting/invoices/${invoiceId}/register-payment`,
      data
    );
  }

  postInvoice(invoiceId: string): Observable<any> {
    return this._httpClient.put<any>(`${this._apiURL}/accounting/invoices/${invoiceId}/post`, {});
  }

  cancelInvoice(invoiceId: string): Observable<any> {
    return this._httpClient.put<any>(`${this._apiURL}/accounting/invoices/${invoiceId}/cancel`, {});
  }
}
