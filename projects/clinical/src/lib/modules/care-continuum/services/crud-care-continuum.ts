import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { careContinuum } from '../interfaces/care-continuum';

/** CRUD service for care continuum records */
@Injectable({ providedIn: 'root' })
export class CrudCareContinuum extends ApiRequestManager<careContinuum> {
  constructor() {
    super();
    this.endpoint = 'care-continuums';
  }
}
