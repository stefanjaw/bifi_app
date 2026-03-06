import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { payment } from '../interfaces/payment';

@Injectable({
  providedIn: 'root',
})
export class CrudPayments extends ApiRequestManager<payment> {
  constructor() {
    super();
    super.endpoint = 'accounting/payments';
  }
}
