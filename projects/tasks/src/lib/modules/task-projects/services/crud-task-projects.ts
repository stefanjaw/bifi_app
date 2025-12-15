import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { taskProject } from '../interfaces/task-projects';

@Injectable({
  providedIn: 'root',
})
export class CrudTaskProjects extends ApiRequestManager<taskProject> {
  constructor() {
    super();
    super.endpoint = 'task-projects';
  }
}
