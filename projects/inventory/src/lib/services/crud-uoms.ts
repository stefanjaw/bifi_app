import { ApiRequestManager } from '@avalantec/base-app/resource';
import { Injectable } from '@angular/core';
import { uom } from '../interfaces/uom';

@Injectable({
  providedIn: 'root',
})
export class CrudUoms extends ApiRequestManager<uom> {
  constructor() {
    super();
    super.endpoint = 'inventory/uoms';
  }
}
