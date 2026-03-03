import { ApiRequestManager } from '@avalantec/base-app/resource';
import { Injectable } from '@angular/core';
import { crm } from '../interfaces/crm';

@Injectable({
  providedIn: 'root',
})
export class CrudCrm extends ApiRequestManager<crm> {
  constructor() {
    super();
    super.endpoint = 'crm';
  }
}
