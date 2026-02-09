import { ApiRequestManager } from '@avalantec/base-app/resource';
import { Injectable } from '@angular/core';
import { bcdPort } from '../interfaces/bcd-port';

@Injectable({
  providedIn: 'root',
})
export class CrudBCDPort extends ApiRequestManager<bcdPort> {
  constructor() {
    super();
    super.endpoint = 'bcd-ports';
  }
}
