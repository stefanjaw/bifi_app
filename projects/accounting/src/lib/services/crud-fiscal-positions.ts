import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { fiscalPosition } from '../interfaces/fiscal-position';

@Injectable({
  providedIn: 'root',
})
export class CrudFiscalPositions extends ApiRequestManager<fiscalPosition> {
  constructor() {
    super();
    super.endpoint = 'accounting/fiscal-positions';
  }
}
