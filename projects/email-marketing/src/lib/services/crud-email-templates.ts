import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { emailTemplate } from '../interfaces/email-template';

@Injectable({
  providedIn: 'root',
})
export class CrudEmailTemplates extends ApiRequestManager<emailTemplate> {
  constructor() {
    super();
    super.endpoint = 'email-templates';
  }
}
