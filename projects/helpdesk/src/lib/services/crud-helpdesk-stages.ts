import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { helpdeskStage } from '../interfaces/helpdesk-stage';

@Injectable({
  providedIn: 'root',
})
export class CrudHelpdeskStages extends ApiRequestManager<helpdeskStage> {
  constructor() {
    super();
    super.endpoint = 'helpdesk-stages';
  }
}
