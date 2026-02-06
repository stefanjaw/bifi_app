import { ApiRequestManager } from '@avalantec/base-app/resource';
import { Injectable } from '@angular/core';
import { bcdTransportOption } from '../interfaces/bcd-transport-option';

@Injectable({
  providedIn: 'root',
})
export class CrudBCDTransportOption extends ApiRequestManager<bcdTransportOption> {
  constructor() {
    super();
    super.endpoint = 'bcd-transport-options';
  }
}
