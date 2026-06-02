import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { mailingList } from '../interfaces/mailing-list';

@Injectable({
  providedIn: 'root',
})
export class CrudMailingLists extends ApiRequestManager<mailingList> {
  constructor() {
    super();
    super.endpoint = 'mailing-lists';
  }
}
