import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { tax } from '../interfaces/tax';

@Injectable({
  providedIn: 'root',
})
export class CrudTaxes extends ApiRequestManager<tax> {
  constructor() {
    super();
    super.endpoint = 'accounting/taxes';
  }
}
