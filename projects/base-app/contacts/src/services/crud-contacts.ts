import { Injectable } from '@angular/core';
import { contact } from '@avalantec/base-app/interfaces';
import { ApiRequestManager } from '@avalantec/base-app/resource';

@Injectable({
  providedIn: 'root',
})
export class CrudContacts extends ApiRequestManager<contact> {
  constructor() {
    super();
    super.endpoint = 'contacts';
  }
}
