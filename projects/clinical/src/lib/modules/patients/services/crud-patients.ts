import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { rxResource } from '@angular/core/rxjs-interop';
import { map, catchError, of } from 'rxjs';
import { patient } from '../interfaces/patient';

/** CRUD service for managing patients */
@Injectable({ providedIn: 'root' })
export class CrudPatients extends ApiRequestManager<patient> {
  constructor() {
    super();
    this.endpoint = 'patients';
  }
}
