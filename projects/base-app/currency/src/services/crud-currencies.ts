import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { currency } from '../interfaces/currency';

@Injectable({
  providedIn: 'root',
})
export class CrudCurrencies extends ApiRequestManager<currency> {
  constructor() {
    super();
    super.endpoint = 'currencies';
  }
}
