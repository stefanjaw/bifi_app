import { ApiRequestManager } from '@avalantec/base-app/resource';
import { Injectable } from '@angular/core';
import { bcdAdditionalInformationType } from '../interfaces/bcd-additional-information-type';

@Injectable({
  providedIn: 'root',
})
export class CrudBCDAdditionalInformationType extends ApiRequestManager<bcdAdditionalInformationType> {
  constructor() {
    super();
    super.endpoint = 'bcd-additional-information-types';
  }
}
