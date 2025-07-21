import { Injectable } from '@angular/core';
import { contact } from '../interfaces/contacts';
import { ApiRequestManager } from 'projects/base-app/src/public-api';

@Injectable({
  providedIn: 'root',
})
export class CrudContacts extends ApiRequestManager<contact> {
  constructor() {
    super();
    super.endpoint = 'contacts';
  }
}
