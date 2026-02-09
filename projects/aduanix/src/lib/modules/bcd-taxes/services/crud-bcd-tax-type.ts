import { ApiRequestManager } from '@avalantec/base-app/resource';
import { Injectable } from '@angular/core';
import { bcdTaxType } from '../interfaces/bcd-tax-type';

@Injectable({
  providedIn: 'root',
})
export class CrudBCDTaxType extends ApiRequestManager<bcdTaxType> {
  constructor() {
    super();
    super.endpoint = 'bcd-tax-types';
  }
}
