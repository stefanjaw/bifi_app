import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { paymentTerm } from '../interfaces/payment-term';

@Injectable({
  providedIn: 'root',
})
export class CrudPaymentTerms extends ApiRequestManager<paymentTerm> {
  constructor() {
    super();
    super.endpoint = 'accounting/payment-terms';
  }
}
