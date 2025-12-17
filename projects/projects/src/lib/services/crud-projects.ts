import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { project } from '../interfaces/projects';

@Injectable({
  providedIn: 'root',
})
export class CrudProjects extends ApiRequestManager<project> {
  constructor() {
    super();
    super.endpoint = 'projects';
  }
}
