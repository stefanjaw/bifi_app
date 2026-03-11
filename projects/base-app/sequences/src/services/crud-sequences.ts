import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { sequence } from '../interfaces/sequence';

@Injectable({
  providedIn: 'root',
})
export class CrudSequences extends ApiRequestManager<sequence> {
  constructor() {
    super();
    super.endpoint = 'sequences';
  }
}
