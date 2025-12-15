import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { task } from '../interfaces/task';

@Injectable({
  providedIn: 'root',
})
export class CrudTasks extends ApiRequestManager<task> {
  constructor() {
    super();
    super.endpoint = 'tasks';
  }
}
