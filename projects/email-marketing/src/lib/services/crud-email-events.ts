import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { emailEvent } from '../interfaces/email-event';

@Injectable({
  providedIn: 'root',
})
export class CrudEmailEvents extends ApiRequestManager<emailEvent> {
  constructor() {
    super();
    super.endpoint = 'email-events';
  }
}
