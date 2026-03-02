import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { salesDashboard } from '../interfaces/sales-dashboard';

@Injectable({
  providedIn: 'root',
})
export class CrudSales extends ApiRequestManager<salesDashboard> {
  constructor() {
    super();
    super.endpoint = 'sales';
  }
}
