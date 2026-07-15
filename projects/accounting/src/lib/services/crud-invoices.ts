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

  /**
   * Fetches all payments registered against a specific invoice
   * @param invoiceId - The invoice ID
   * @returns Observable of payment records
   */
  getPayments(invoiceId: string): Observable<any[]> {
    return this._httpClient.get<any[]>(`${this._apiURL}/accounting/invoices/${invoiceId}/payments`);
  }

  /**
   * Registers a new payment against an invoice
   * @param invoiceId - The invoice ID
   * @param data - Payment registration data
   * @returns Observable of the registration result
   */
  registerPayment(invoiceId: string, data: any): Observable<any> {
    return this._httpClient.post<any>(
      `${this._apiURL}/accounting/invoices/${invoiceId}/register-payment`,
      data
    );
  }

  /**
   * Posts an invoice, making it final and non-editable
   * @param invoiceId - The invoice ID
   * @returns Observable of the posted invoice
   */
  postInvoice(invoiceId: string): Observable<any> {
    return this._httpClient.put<any>(`${this._apiURL}/accounting/invoices/${invoiceId}/post`, {});
  }

  /**
   * Cancels a posted invoice
   * @param invoiceId - The invoice ID
   * @returns Observable of the cancelled invoice
   */
  cancelInvoice(invoiceId: string): Observable<any> {
    return this._httpClient.put<any>(`${this._apiURL}/accounting/invoices/${invoiceId}/cancel`, {});
  }
}
