import { ApiRequestManager } from '@avalantec/base-app/resource';
import { Injectable } from '@angular/core';
import { bcdTaxId } from '../interfaces/bcd-tax-id';

@Injectable({
  providedIn: 'root',
})
export class CrudBCDTaxId extends ApiRequestManager<bcdTaxId> {
  constructor() {
    super();
    super.endpoint = 'bcd-tax-ids';
  }
}
