import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { salesTarget } from '../interfaces/sales-target';

@Injectable({
  providedIn: 'root',
})
export class CrudSalesTargets extends ApiRequestManager<salesTarget> {
  constructor() {
    super();
    super.endpoint = 'sales-targets';
  }
}
