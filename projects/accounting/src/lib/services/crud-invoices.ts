import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { invoice } from '../interfaces/invoice';
import { LIBRARY_CONFIG } from '@avalantec/base-app/core';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CrudInvoices extends ApiRequestManager<invoice> {
  private http = inject(HttpClient);
  private apiURL = inject(LIBRARY_CONFIG).apiURL;

  constructor() {
    super();
    this.endpoint = 'accounting/invoices';
  }

  getPayments(invoiceId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiURL}/accounting/invoices/${invoiceId}/payments`);
  }

  registerPayment(invoiceId: string, data: any): Observable<any> {
    return this.http.post<any>(`${this.apiURL}/accounting/invoices/${invoiceId}/register-payment`, data);
  }

  postInvoice(invoiceId: string): Observable<any> {
    return this.http.put<any>(`${this.apiURL}/accounting/invoices/${invoiceId}/post`, {});
  }

  cancelInvoice(invoiceId: string): Observable<any> {
    return this.http.put<any>(`${this.apiURL}/accounting/invoices/${invoiceId}/cancel`, {});
  }

}
