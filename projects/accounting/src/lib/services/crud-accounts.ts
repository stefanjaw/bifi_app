import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { account } from '../interfaces/account';

@Injectable({
  providedIn: 'root',
})
export class CrudAccounts extends ApiRequestManager<account> {
  constructor() {
    super();
    super.endpoint = 'accounting/accounts';
  }
}
