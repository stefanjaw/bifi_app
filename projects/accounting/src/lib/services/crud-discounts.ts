import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { discount } from '../interfaces/discount';

@Injectable({
  providedIn: 'root',
})
export class CrudDiscounts extends ApiRequestManager<discount> {
  constructor() {
    super();
    super.endpoint = 'accounting/discounts';
  }
}
