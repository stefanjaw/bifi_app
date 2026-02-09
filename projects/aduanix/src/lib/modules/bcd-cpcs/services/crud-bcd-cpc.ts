import { ApiRequestManager } from '@avalantec/base-app/resource';
import { Injectable } from '@angular/core';
import { bcdCpc } from '../interfaces/bcd-cpc';

@Injectable({
  providedIn: 'root',
})
export class CrudBCDCpc extends ApiRequestManager<bcdCpc> {
  constructor() {
    super();
    super.endpoint = 'bcd-cpcs';
  }
}
