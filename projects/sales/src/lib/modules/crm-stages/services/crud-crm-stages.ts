import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { crmStage } from '../interfaces/crm-stage';

@Injectable({
  providedIn: 'root',
})
export class CrudCrmStages extends ApiRequestManager<crmStage> {
  constructor() {
    super();
    super.endpoint = 'crm-stages';
  }
}
