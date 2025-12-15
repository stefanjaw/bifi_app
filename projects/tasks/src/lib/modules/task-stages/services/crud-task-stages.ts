import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { taskStage } from '../interfaces/task-stage';

@Injectable({
  providedIn: 'root',
})
export class CrudTaskStages extends ApiRequestManager<taskStage> {
  constructor() {
    super();
    super.endpoint = 'task-stages';
  }
}
