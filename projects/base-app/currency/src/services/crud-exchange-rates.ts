import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { exchangeRate } from '../interfaces/exchange-rate';

@Injectable({
  providedIn: 'root',
})
export class CrudExchangeRates extends ApiRequestManager<exchangeRate> {
  constructor() {
    super();
    super.endpoint = 'exchange-rates';
  }
}
