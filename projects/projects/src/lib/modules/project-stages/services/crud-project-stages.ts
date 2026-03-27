import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { projectStage } from '../interfaces/project-stage';

@Injectable({
  providedIn: 'root',
})
export class CrudProjectStages extends ApiRequestManager<projectStage> {
  constructor() {
    super();
    super.endpoint = 'project-stages';
  }
}
