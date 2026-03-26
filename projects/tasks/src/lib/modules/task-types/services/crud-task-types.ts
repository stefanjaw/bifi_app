import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { taskType } from '../interfaces/task-type';

@Injectable({
  providedIn: 'root',
})
export class CrudTaskTypes extends ApiRequestManager<taskType> {
  constructor() {
    super();
    super.endpoint = 'task-types';
  }
}
