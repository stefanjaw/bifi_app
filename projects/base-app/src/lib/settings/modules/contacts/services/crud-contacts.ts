import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/system';
import { contact } from '../interfaces/contacts';

@Injectable({
  providedIn: 'root',
})
export class CrudContacts extends ApiRequestManager<contact> {
  constructor() {
    super();
    super.endpoint = 'contacts';
  }
}
