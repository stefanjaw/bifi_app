import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { recurrentTask } from '../interfaces/recurrent-task';

/** CRUD service for managing recurrent tasks */
@Injectable({ providedIn: 'root' })
export class CrudRecurrentTasks extends ApiRequestManager<recurrentTask> {
  constructor() {
    super();
    this.endpoint = 'recurrent-tasks';
  }
}
