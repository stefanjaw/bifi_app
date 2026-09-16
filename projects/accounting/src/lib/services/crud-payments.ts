import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { payment } from '../interfaces/payment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CrudPayments extends ApiRequestManager<payment> {
  constructor() {
    super();
    super.endpoint = 'accounting/payments';
  }

  /**
   * Fetches advance payments available for application (confirmed, not
   * linked to any invoice), optionally filtered by partner
   * @param partnerId - Optional contact ID filter
   * @returns Observable of pending advance payments
   */
  getPendingAdvances(partnerId?: string): Observable<payment[]> {
    const params = partnerId ? { params: { partnerId } } : undefined;
    return this._httpClient.get<payment[]>(`${this._apiURL}/accounting/payments/advances`, params);
  }

  /**
   * Applies an advance payment to a posted invoice
   * @param paymentId - The advance payment ID
   * @param invoiceId - The target posted invoice ID
   * @returns Observable of the applied payment
   */
  applyPayment(paymentId: string, invoiceId: string): Observable<payment> {
    return this._httpClient.post<payment>(
      `${this._apiURL}/accounting/payments/${paymentId}/apply`,
      { invoiceId }
    );
  }
}
