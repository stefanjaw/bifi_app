import { ApiRequestManager } from '@avalantec/base-app/resource';
import { Injectable } from '@angular/core';
import { bcdChargeCode } from '../interfaces/bcd-charge-code';

@Injectable({
  providedIn: 'root',
})
export class CrudBCDChargeCode extends ApiRequestManager<bcdChargeCode> {
  constructor() {
    super();
    super.endpoint = 'bcd-charge-codes';
  }
}
