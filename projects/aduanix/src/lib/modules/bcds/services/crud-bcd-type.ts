import { ApiRequestManager } from '@avalantec/base-app/resource';
import { Injectable } from '@angular/core';
import { bcdType } from '../interfaces/bcd-type';

@Injectable({
  providedIn: 'root',
})
export class CrudBCDType extends ApiRequestManager<bcdType> {
  constructor() {
    super();
    super.endpoint = 'bcd-types';
  }
}
