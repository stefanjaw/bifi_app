import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { careContinuumLevel } from '../interfaces/settings';

/** CRUD service for managing care continuum levels */
@Injectable({ providedIn: 'root' })
export class CrudCareContinuumLevels extends ApiRequestManager<careContinuumLevel> {
  constructor() {
    super();
    this.endpoint = 'care-continuum-levels';
  }
}
