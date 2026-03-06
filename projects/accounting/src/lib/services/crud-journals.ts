import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { journal } from '../interfaces/journal';

@Injectable({
  providedIn: 'root',
})
export class CrudJournals extends ApiRequestManager<journal> {
  constructor() {
    super();
    super.endpoint = 'accounting/journals';
  }
}
